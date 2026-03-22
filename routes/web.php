<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/', HomeController::class)->name('home');

    Route::resource('contacts', ContactController::class)->except(['show']);
    Route::resource('invoices', InvoiceController::class)->except(['show']);
    Route::resource('expenses', ExpenseController::class)->except(['show']);
    Route::get('expenses/{expense}/download', [ExpenseController::class, 'downloadInvoice'])->name('expenses.download');
});
