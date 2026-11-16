<?php
/* Роутер для локального запуска:  php -S localhost:8000 router.php
 * Повторяет поведение Vercel: /about -> about.html, свой 404 и т.д. */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;
if ($path !== '/' && is_file($file)) return false;                 // реальные файлы и api/*.php
if ($path === '/') { readfile(__DIR__ . '/index.html'); return true; }
$page = __DIR__ . rtrim($path, '/') . '.html';
if (is_file($page)) { readfile($page); return true; }
http_response_code(404);
readfile(__DIR__ . '/404.html');
