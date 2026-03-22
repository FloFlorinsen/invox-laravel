<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// TEMP: debug — dump server vars for root request before Laravel handles it
if (($_SERVER['REQUEST_URI'] ?? '') === '/tools/invox/' || ($_SERVER['REQUEST_URI'] ?? '') === '/tools/invox') {
    header('Content-Type: application/json');
    echo json_encode([
        'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? null,
        'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'] ?? null,
        'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? null,
        'SCRIPT_FILENAME' => $_SERVER['SCRIPT_FILENAME'] ?? null,
        'PHP_SELF' => $_SERVER['PHP_SELF'] ?? null,
        'PATH_INFO' => $_SERVER['PATH_INFO'] ?? null,
        'REDIRECT_URL' => $_SERVER['REDIRECT_URL'] ?? null,
        'REDIRECT_STATUS' => $_SERVER['REDIRECT_STATUS'] ?? null,
        'serving_file' => __FILE__,
    ], JSON_PRETTY_PRINT);
    exit;
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
