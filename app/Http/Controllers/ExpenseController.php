<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('expenses/index', [
            'expenses' => Expense::query()
                ->latest('date')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('expenses/create', [
            'categories' => Expense::query()
                ->whereNotNull('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category'),
        ]);
    }

    public function store(ExpenseRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $invoicePath = null;
        if ($request->hasFile('invoice')) {
            $invoicePath = $request->file('invoice')->store('expenses', 'local');
        }

        Expense::query()->create([
            ...$validated,
            'invoice_path' => $invoicePath,
        ]);

        return to_route('expenses.index');
    }

    public function edit(Expense $expense): Response
    {
        return Inertia::render('expenses/edit', [
            'expense' => $expense,
            'categories' => Expense::query()
                ->whereNotNull('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category'),
        ]);
    }

    public function update(ExpenseRequest $request, Expense $expense): RedirectResponse
    {
        $validated = $request->validated();

        $invoicePath = $expense->invoice_path;
        if ($request->hasFile('invoice')) {
            if ($expense->invoice_path) {
                Storage::disk('local')->delete($expense->invoice_path);
            }
            $invoicePath = $request->file('invoice')->store('expenses', 'local');
        }

        $expense->update([
            ...$validated,
            'invoice_path' => $invoicePath,
        ]);

        return to_route('expenses.index');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        if ($expense->invoice_path) {
            Storage::disk('local')->delete($expense->invoice_path);
        }

        $expense->delete();

        return to_route('expenses.index');
    }

    public function downloadInvoice(Expense $expense): mixed
    {
        if (! $expense->invoice_path || ! Storage::disk('local')->exists($expense->invoice_path)) {
            abort(404);
        }

        return Storage::disk('local')->download($expense->invoice_path);
    }
}
