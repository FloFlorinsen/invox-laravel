<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('contacts/index', [
            'contacts' => Contact::query()->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('contacts/create');
    }

    public function store(ContactRequest $request): RedirectResponse
    {
        Contact::query()->create($request->validated());

        return to_route('contacts.index');
    }

    public function edit(Contact $contact): Response
    {
        return Inertia::render('contacts/edit', [
            'contact' => $contact,
        ]);
    }

    public function update(ContactRequest $request, Contact $contact): RedirectResponse
    {
        $contact->update($request->validated());

        return to_route('contacts.index');
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return to_route('contacts.index');
    }
}
