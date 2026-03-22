<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$request = Request::capture();

// TEMP: always dump request debug info
@file_put_contents(__DIR__ . '/../debug-request.json', json_encode([
    'pathInfo' => $request->getPathInfo(),
    'baseUrl' => $request->getBaseUrl(),
    'method' => $request->getMethod(),
    'requestUri' => $request->getRequestUri(),
    'scriptName' => $request->server->get('SCRIPT_NAME'),
    'phpSelf' => $request->server->get('PHP_SELF'),
    'file' => __FILE__,
], JSON_PRETTY_PRINT));

$app->handleRequest($request);
