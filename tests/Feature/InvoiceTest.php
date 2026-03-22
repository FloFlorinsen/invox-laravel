<?php

use App\Models\Contact;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('invoices index page can be rendered', function () {
    $this->get(route('invoices.index'))->assertOk();
});

test('invoices create page can be rendered', function () {
    $this->get(route('invoices.create'))->assertOk();
});

test('an invoice can be created', function () {
    $contact = Contact::factory()->create();

    $response = $this->post(route('invoices.store'), [
        'number' => 'INV-001',
        'date' => '2026-01-15',
        'contact_id' => $contact->id,
        'items' => [
            ['name' => 'Widget', 'quantity' => 2, 'price' => '49.99'],
        ],
    ]);

    $response->assertRedirect(route('invoices.index'));
    $this->assertDatabaseHas('invoices', ['number' => 'INV-001']);
    $this->assertDatabaseHas('invoice_items', ['name' => 'Widget', 'quantity' => 2, 'price' => 49.99]);
});

test('invoice creation requires at least one item', function () {
    $contact = Contact::factory()->create();

    $this->post(route('invoices.store'), [
        'number' => 'INV-001',
        'date' => '2026-01-15',
        'contact_id' => $contact->id,
        'items' => [],
    ])->assertSessionHasErrors('items');
});

test('invoice number must be unique', function () {
    Invoice::factory()->create(['number' => 'INV-001']);
    $contact = Contact::factory()->create();

    $this->post(route('invoices.store'), [
        'number' => 'INV-001',
        'date' => '2026-01-15',
        'contact_id' => $contact->id,
        'items' => [['name' => 'Item', 'quantity' => 1, 'price' => '10.00']],
    ])->assertSessionHasErrors('number');
});

test('invoices edit page can be rendered', function () {
    $invoice = Invoice::factory()->create();

    $this->get(route('invoices.edit', $invoice))->assertOk();
});

test('an invoice can be updated', function () {
    $invoice = Invoice::factory()->create();
    InvoiceItem::factory()->for($invoice)->create();
    $contact = Contact::factory()->create();

    $response = $this->put(route('invoices.update', $invoice), [
        'number' => 'INV-UPDATED',
        'date' => '2026-06-01',
        'contact_id' => $contact->id,
        'items' => [
            ['name' => 'New Item', 'quantity' => 5, 'price' => '100.00'],
        ],
    ]);

    $response->assertRedirect(route('invoices.index'));
    expect($invoice->fresh()->number)->toBe('INV-UPDATED');
    expect($invoice->fresh()->items)->toHaveCount(1);
    expect($invoice->fresh()->items->first()->name)->toBe('New Item');
    expect($invoice->fresh()->items->first()->price)->toBe('100.00');
});

test('an invoice can be deleted', function () {
    $invoice = Invoice::factory()->create();
    InvoiceItem::factory()->for($invoice)->create();

    $response = $this->delete(route('invoices.destroy', $invoice));

    $response->assertRedirect(route('invoices.index'));
    $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
    $this->assertDatabaseMissing('invoice_items', ['invoice_id' => $invoice->id]);
});
