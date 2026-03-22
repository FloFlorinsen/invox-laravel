<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $currentYear = (int) now()->year;
        $year = (int) ($request->query('year') ?? $currentYear);
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';

        $availableYears = $this->availableYears($currentYear, $isSqlite);

        $invoices = Invoice::query()
            ->with('contact')
            ->addSelect(['total' => InvoiceItem::query()
                ->selectRaw('SUM(price * quantity)')
                ->whereColumn('invoice_id', 'invoices.id'),
            ])
            ->whereYear('date', $year)
            ->latest('date')
            ->get();

        $expenses = Expense::query()
            ->whereYear('date', $year)
            ->latest('date')
            ->get();

        $totalIncome = (float) $invoices->sum('total');
        $totalExpenses = (float) $expenses->sum('price');

        return Inertia::render('home', [
            'year' => $year,
            'availableYears' => $availableYears,
            'invoices' => $invoices,
            'expenses' => $expenses,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'profit' => $totalIncome - $totalExpenses,
        ]);
    }

    /**
     * @return int[]
     */
    private function availableYears(int $currentYear, bool $isSqlite): array
    {
        $yearExpr = $isSqlite ? "CAST(strftime('%Y', date) AS INTEGER)" : 'YEAR(date)';

        $invoiceYears = Invoice::query()
            ->selectRaw("DISTINCT $yearExpr as year")
            ->pluck('year');

        $expenseYears = Expense::query()
            ->selectRaw("DISTINCT $yearExpr as year")
            ->pluck('year');

        $years = $invoiceYears->merge($expenseYears)
            ->push($currentYear)
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        return array_map('intval', $years);
    }
}
