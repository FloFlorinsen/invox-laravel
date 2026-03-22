<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Models\Contact;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('invoices/index', [
            'invoices' => Invoice::query()
                ->with('contact', 'items')
                ->addSelect(['total' => \App\Models\InvoiceItem::query()
                    ->selectRaw('SUM(price * quantity)')
                    ->whereColumn('invoice_id', 'invoices.id'),
                ])
                ->latest('date')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('invoices/create', [
            'contacts' => Contact::query()->orderBy('name')->get(),
            'nextNumber' => Invoice::nextNumber(),
        ]);
    }

    public function store(InvoiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $invoice = Invoice::query()->create([
            'number' => $validated['number'],
            'date' => $validated['date'],
            'contact_id' => $validated['contact_id'],
        ]);

        $invoice->items()->createMany($validated['items']);

        return to_route('invoices.index');
    }

    public function edit(Invoice $invoice): Response
    {
        return Inertia::render('invoices/edit', [
            'invoice' => $invoice->load('items', 'contact'),
            'contacts' => Contact::query()->orderBy('name')->get(),
        ]);
    }

    public function update(InvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $validated = $request->validated();

        $invoice->update([
            'number' => $validated['number'],
            'date' => $validated['date'],
            'contact_id' => $validated['contact_id'],
        ]);

        $invoice->items()->delete();
        $invoice->items()->createMany($validated['items']);

        return to_route('invoices.index');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return to_route('invoices.index');
    }
}
