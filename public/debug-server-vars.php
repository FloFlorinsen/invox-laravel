<?php
header('Content-Type: application/json');
echo json_encode([
    'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? null,
    'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? null,
    'SCRIPT_FILENAME' => $_SERVER['SCRIPT_FILENAME'] ?? null,
    'PHP_SELF' => $_SERVER['PHP_SELF'] ?? null,
    'PATH_INFO' => $_SERVER['PATH_INFO'] ?? null,
    'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'] ?? null,
    'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'] ?? null,
    'REDIRECT_URL' => $_SERVER['REDIRECT_URL'] ?? null,
    'REDIRECT_STATUS' => $_SERVER['REDIRECT_STATUS'] ?? null,
], JSON_PRETTY_PRINT);
