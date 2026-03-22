<?php

use App\Models\Expense;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('expenses index page can be rendered', function () {
    $this->get(route('expenses.index'))->assertOk();
});

test('expenses create page can be rendered', function () {
    $this->get(route('expenses.create'))->assertOk();
});

test('an expense can be created', function () {
    Storage::fake('local');

    $file = UploadedFile::fake()->create('invoice.pdf', 100, 'application/pdf');

    $response = $this->post(route('expenses.store'), [
        'name' => 'Office Supplies',
        'date' => '2026-03-15',
        'price' => '49.99',
        'number' => 'EXP-001',
        'category' => 'Büromaterial',
        'invoice' => $file,
    ]);

    $response->assertRedirect(route('expenses.index'));
    $this->assertDatabaseHas('expenses', [
        'name' => 'Office Supplies',
        'price' => 49.99,
        'number' => 'EXP-001',
        'category' => 'Büromaterial',
    ]);

    $expense = Expense::query()->first();
    Storage::disk('local')->assertExists($expense->invoice_path);
});

test('an expense can be created without optional fields', function () {
    $response = $this->post(route('expenses.store'), [
        'name' => 'Simple Expense',
        'date' => '2026-03-15',
        'price' => '10.00',
    ]);

    $response->assertRedirect(route('expenses.index'));
    $this->assertDatabaseHas('expenses', [
        'name' => 'Simple Expense',
        'number' => null,
        'category' => null,
        'invoice_path' => null,
    ]);
});

test('expense creation validates required fields', function () {
    $this->post(route('expenses.store'), [])
        ->assertSessionHasErrors(['name', 'date', 'price']);
});

test('expenses edit page can be rendered', function () {
    $expense = Expense::factory()->create();

    $this->get(route('expenses.edit', $expense))->assertOk();
});

test('an expense can be updated', function () {
    $expense = Expense::factory()->create();

    $response = $this->put(route('expenses.update', $expense), [
        'name' => 'Updated Expense',
        'date' => '2026-06-01',
        'price' => '99.99',
        'number' => 'EXP-UPDATED',
        'category' => 'Software',
    ]);

    $response->assertRedirect(route('expenses.index'));
    expect($expense->fresh()->name)->toBe('Updated Expense');
    expect($expense->fresh()->price)->toBe('99.99');
    expect($expense->fresh()->category)->toBe('Software');
});

test('an expense can be updated with a new invoice file', function () {
    Storage::fake('local');

    $oldFile = UploadedFile::fake()->create('old.pdf', 100, 'application/pdf');
    $oldPath = $oldFile->store('expenses', 'local');
    $expense = Expense::factory()->create(['invoice_path' => $oldPath]);

    $newFile = UploadedFile::fake()->create('new.pdf', 100, 'application/pdf');

    $this->put(route('expenses.update', $expense), [
        'name' => $expense->name,
        'date' => $expense->date->format('Y-m-d'),
        'price' => $expense->price,
        'invoice' => $newFile,
    ]);

    Storage::disk('local')->assertMissing($oldPath);
    $updated = $expense->fresh();
    Storage::disk('local')->assertExists($updated->invoice_path);
});

test('an expense can be deleted', function () {
    Storage::fake('local');

    $file = UploadedFile::fake()->create('invoice.pdf', 100, 'application/pdf');
    $path = $file->store('expenses', 'local');
    $expense = Expense::factory()->create(['invoice_path' => $path]);

    $response = $this->delete(route('expenses.destroy', $expense));

    $response->assertRedirect(route('expenses.index'));
    $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    Storage::disk('local')->assertMissing($path);
});

test('expense invoice can be downloaded', function () {
    Storage::fake('local');

    $file = UploadedFile::fake()->create('invoice.pdf', 100, 'application/pdf');
    $path = $file->store('expenses', 'local');
    $expense = Expense::factory()->create(['invoice_path' => $path]);

    $this->get(route('expenses.download', $expense))->assertOk();
});

test('expense download returns 404 when no invoice exists', function () {
    $expense = Expense::factory()->create(['invoice_path' => null]);

    $this->get(route('expenses.download', $expense))->assertNotFound();
});

test('create page returns existing categories', function () {
    Expense::factory()->create(['category' => 'Software']);
    Expense::factory()->create(['category' => 'Hardware']);

    $response = $this->get(route('expenses.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('categories', 2)
    );
});
