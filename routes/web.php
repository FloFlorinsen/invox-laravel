<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

// TEMP: debug server vars — remove after fixing routing
Route::any('/debug-server-vars', fn () => response()->json([
    'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? null,
    'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? null,
    'SCRIPT_FILENAME' => $_SERVER['SCRIPT_FILENAME'] ?? null,
    'PHP_SELF' => $_SERVER['PHP_SELF'] ?? null,
    'PATH_INFO' => $_SERVER['PATH_INFO'] ?? null,
    'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'] ?? null,
    'REDIRECT_URL' => $_SERVER['REDIRECT_URL'] ?? null,
    'pathInfo' => request()->getPathInfo(),
    'baseUrl' => request()->getBaseUrl(),
    'method' => request()->getMethod(),
]));

// TEMP: test root route without auth
Route::any('/test-root', fn () => response()->json([
    'works' => true,
    'method' => request()->getMethod(),
    'pathInfo' => request()->getPathInfo(),
]));

// TEMP: read debug log
Route::get('/debug-log', fn () => response()->json(
    json_decode(file_get_contents(storage_path('logs/debug-request.json')) ?: '{}', true) ?? ['error' => 'no log file']
));

// TEMP: test root without auth
Route::get('/', fn () => response()->json(['root_works' => true, 'method' => request()->getMethod()]));

Route::middleware(['auth'])->group(function () {
    // Route::get('/', HomeController::class)->name('home');

    Route::resource('contacts', ContactController::class)->except(['show']);
    Route::resource('invoices', InvoiceController::class)->except(['show']);
    Route::resource('expenses', ExpenseController::class)->except(['show']);
    Route::get('expenses/{expense}/download', [ExpenseController::class, 'downloadInvoice'])->name('expenses.download');
});
