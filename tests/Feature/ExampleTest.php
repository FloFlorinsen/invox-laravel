<?php

use App\Models\Contact;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;

test('home page can be rendered', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('home'))->assertOk();
});

test('unauthenticated users are redirected to login', function () {
    $this->get(route('home'))->assertRedirect(route('login'));
});

test('home page shows EÜR data for current year', function () {
    $user = User::factory()->create();
    $contact = Contact::factory()->create();
    $invoice = Invoice::factory()->create([
        'date' => now()->startOfYear(),
        'contact_id' => $contact->id,
    ]);
    InvoiceItem::factory()->for($invoice)->create([
        'price' => 100.00,
        'quantity' => 2,
    ]);
    Expense::factory()->create([
        'date' => now()->startOfYear(),
        'price' => 50.00,
        'category' => 'Software',
    ]);

    $response = $this->actingAs($user)->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('home')
        ->where('year', (int) now()->year)
        ->has('invoices', 1)
        ->has('expenses', 1)
        ->where('totalIncome', fn ($v) => (float) $v === 200.0)
        ->where('totalExpenses', fn ($v) => (float) $v === 50.0)
        ->where('profit', fn ($v) => (float) $v === 150.0)
    );
});

test('home page can filter by year', function () {
    $user = User::factory()->create();
    Expense::factory()->create([
        'date' => '2025-06-15',
        'price' => 75.00,
    ]);

    $response = $this->actingAs($user)->get(route('home', ['year' => 2025]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('year', 2025)
        ->has('expenses', 1)
        ->has('invoices', 0)
        ->where('totalExpenses', fn ($v) => (float) $v === 75.0)
    );
});
