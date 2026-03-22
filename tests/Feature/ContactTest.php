<?php

use App\Models\Contact;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('contacts index page can be rendered', function () {
    $this->get(route('contacts.index'))->assertOk();
});

test('contacts create page can be rendered', function () {
    $this->get(route('contacts.create'))->assertOk();
});

test('a contact can be created', function () {
    $response = $this->post(route('contacts.store'), [
        'name' => 'Acme Corp',
        'address_lines' => ['123 Main St', '12345 Springfield'],
    ]);

    $response->assertRedirect(route('contacts.index'));
    $this->assertDatabaseHas('contacts', ['name' => 'Acme Corp']);
});

test('contact creation requires a name', function () {
    $this->post(route('contacts.store'), [
        'name' => '',
        'address_lines' => ['123 Main St'],
    ])->assertSessionHasErrors('name');
});

test('contacts edit page can be rendered', function () {
    $contact = Contact::factory()->create();

    $this->get(route('contacts.edit', $contact))->assertOk();
});

test('a contact can be updated', function () {
    $contact = Contact::factory()->create();

    $response = $this->put(route('contacts.update', $contact), [
        'name' => 'Updated Name',
        'address_lines' => ['New Address'],
    ]);

    $response->assertRedirect(route('contacts.index'));
    expect($contact->fresh()->name)->toBe('Updated Name');
});

test('a contact can be deleted', function () {
    $contact = Contact::factory()->create();

    $response = $this->delete(route('contacts.destroy', $contact));

    $response->assertRedirect(route('contacts.index'));
    $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);
});
