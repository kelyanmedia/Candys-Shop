<?php
/*
 * Принимает отзыв с feedback.html и пересылает его в Telegram.
 * Токен бота хранится только на сервере (api/config.php) и не виден в браузере.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}
$config = require $configFile;
if (empty($config['bot_token']) || empty($config['chat_id'])) {
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}

// ---------- Input ----------
$raw = file_get_contents('php://input', false, null, 0, 20000);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'bad_json']);
}

// Honeypot: real visitors never fill this hidden field
if (!empty($in['website'])) {
    respond(200, ['ok' => true]);
}

$rating = $in['rating'] ?? null;
if (!is_int($rating) && !(is_string($rating) && ctype_digit($rating))) {
    respond(422, ['ok' => false, 'error' => 'rating_required']);
}
$rating = (int)$rating;
if ($rating < 0 || $rating > 10) {
    respond(422, ['ok' => false, 'error' => 'rating_range']);
}

function clean($v, int $max): string {
    if (!is_string($v)) return '';
    $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
}

$name     = clean($in['name'] ?? '', 100);
$contact  = clean($in['contact'] ?? '', 100);
$disliked = clean($in['disliked'] ?? '', 1500);
$improve  = clean($in['improve'] ?? '', 1500);
$lang     = in_array($in['lang'] ?? '', ['ru', 'en', 'uz'], true) ? $in['lang'] : 'ru';
$date     = clean($in['date'] ?? '', 10);
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = '';

$likedMap = [
    'taste' => 'Вкус', 'range' => 'Ассортимент', 'packaging' => 'Упаковка',
    'service' => 'Обслуживание', 'price' => 'Цены', 'atmosphere' => 'Атмосфера',
];
$liked = [];
foreach ((array)($in['liked'] ?? []) as $item) {
    if (is_string($item) && isset($likedMap[$item])) $liked[] = $likedMap[$item];
}
$liked = array_values(array_unique($liked));

// ---------- Rate limit (per IP, file based) ----------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$limit  = (int)($config['rate_limit'] ?? 5);
$window = (int)($config['rate_window'] ?? 600);
$rlFile = sys_get_temp_dir() . '/uhdf_rl_' . hash('sha256', $ip) . '.json';
$now = time();
$hits = is_file($rlFile) ? (json_decode((string)file_get_contents($rlFile), true) ?: []) : [];
$hits = array_values(array_filter($hits, fn($t) => is_int($t) && $t > $now - $window));
if (count($hits) >= $limit) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}

// ---------- Message ----------
$e = fn(string $s) => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

if ($rating >= 9)      { $mark = '🟢'; $group = 'промоутер'; }
elseif ($rating >= 7)  { $mark = '🟡'; $group = 'нейтрал'; }
else                   { $mark = '🔴'; $group = 'критик'; }

$lines = [
    '<b>🍯 Новый отзыв — Uzbek Halva &amp; Dry Fruits</b>',
    '',
    "{$mark} <b>Оценка: {$rating}/10</b> ({$group})",
];
if ($name !== '')    $lines[] = '👤 <b>Имя:</b> ' . $e($name);
if ($contact !== '') $lines[] = '📞 <b>Контакт:</b> ' . $e($contact);
if ($date !== '')    $lines[] = '📅 <b>Дата визита:</b> ' . $e(date('d.m.Y', strtotime($date)));
if ($liked)          $lines[] = '👍 <b>Понравилось:</b> ' . $e(implode(', ', $liked));
if ($disliked !== '') { $lines[] = ''; $lines[] = '👎 <b>Не понравилось:</b>'; $lines[] = $e($disliked); }
if ($improve !== '')  { $lines[] = ''; $lines[] = '💡 <b>Как стать лучше:</b>'; $lines[] = $e($improve); }
$lines[] = '';
$lines[] = '🌐 Язык сайта: ' . strtoupper($lang);
$text = implode("\n", $lines);

// ---------- Send to Telegram ----------
$url = rtrim($config['api_base'] ?? 'https://api.telegram.org', '/')
     . '/bot' . $config['bot_token'] . '/sendMessage';
$body = json_encode([
    'chat_id' => $config['chat_id'],
    'text' => $text,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);
$res = curl_exec($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (PHP_VERSION_ID < 80000) { curl_close($ch); }

$tg = is_string($res) ? json_decode($res, true) : null;
if ($status !== 200 || empty($tg['ok'])) {
    error_log('[feedback] Telegram error: HTTP ' . $status . ' ' . (is_string($res) ? $res : 'no response'));
    respond(502, ['ok' => false, 'error' => 'telegram_failed']);
}

$hits[] = $now;
@file_put_contents($rlFile, json_encode($hits), LOCK_EX);

respond(200, ['ok' => true]);
