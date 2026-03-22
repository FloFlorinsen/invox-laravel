import { Head, router } from '@inertiajs/react'
import { Card, ToggleButton, ToggleButtonGroup } from '@heroui/react'
import { format, parseISO } from 'date-fns'
import type { Key } from 'react'
import AppLayout from '@/components/app-layout'
import LinkButton from '@/components/link-button'
import { edit as editExpense } from '@/routes/expenses'
import { edit as editInvoice } from '@/routes/invoices'
import type { Expense, Invoice } from '@/types'

type InvoiceWithTotal = Invoice & { total: string | null }

interface CategoryTotal {
    category: string
    total: number
}

interface Props {
    year: number
    availableYears: number[]
    invoices: InvoiceWithTotal[]
    expenses: Expense[]
    expenseCategoryTotals: CategoryTotal[]
    totalIncome: number
    totalExpenses: number
    profit: number
}

const formatCurrency = (value: number | string) =>
    Number(value).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
    })

const formatDate = (date: string) => format(parseISO(date), 'dd.MM.yyyy')

export default function Home({
    year,
    availableYears,
    invoices,
    expenses,
    expenseCategoryTotals,
    totalIncome,
    totalExpenses,
    profit,
}: Props) {
    const handleYearChange = (keys: Set<Key>) => {
        const selected = [...keys][0]
        if (selected !== undefined) {
            router.get('/', { year: String(selected) }, { preserveState: true })
        }
    }

    return (
        <AppLayout>
            <Head title={`EÜR ${year}`} />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">
                        Einnahmenüberschussrechnung {year}
                    </h1>
                    <ToggleButtonGroup
                        selectionMode="single"
                        selectedKeys={new Set([String(year)])}
                        onSelectionChange={handleYearChange}
                        disallowEmptySelection
                        size="sm"
                    >
                        {availableYears.map((y) => (
                            <ToggleButton key={String(y)} id={String(y)}>
                                {y}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <Card.Content>
                            <p className="text-default-500 text-sm">Einnahmen</p>
                            <p className="text-2xl font-bold tabular-nums text-success">
                                {formatCurrency(totalIncome)}
                            </p>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <p className="text-default-500 text-sm">Ausgaben</p>
                            <p className="text-2xl font-bold tabular-nums text-danger">
                                {formatCurrency(totalExpenses)}
                            </p>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <p className="text-default-500 text-sm">Gewinn / Verlust</p>
                            <p className={`text-2xl font-bold tabular-nums ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {formatCurrency(profit)}
                            </p>
                        </Card.Content>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                Einnahmen
                                <span className="text-default-400 ml-2 text-sm font-normal">
                                    ({invoices.length})
                                </span>
                            </Card.Title>
                        </Card.Header>
                        <Card.Content>
                            {invoices.length === 0 ? (
                                <p className="text-default-500 py-4 text-center text-sm">
                                    Keine Rechnungen in {year}.
                                </p>
                            ) : (
                                <div className="divide-divider divide-y">
                                    {invoices.map((invoice) => (
                                        <div
                                            key={invoice.id}
                                            className="flex items-center justify-between gap-3 py-2.5"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <LinkButton
                                                    href={editInvoice(invoice.id).url}
                                                    variant="tertiary"
                                                    size="sm"
                                                    className="h-auto p-0"
                                                >
                                                    {invoice.number}
                                                </LinkButton>
                                                <p className="text-default-500 text-sm">
                                                    {invoice.contact.name} · {formatDate(invoice.date)}
                                                </p>
                                            </div>
                                            <span className="text-sm font-medium tabular-nums">
                                                {formatCurrency(invoice.total ?? 0)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Content>
                        {invoices.length > 0 && (
                            <Card.Footer className="justify-between font-semibold">
                                <span className="text-sm">Gesamt</span>
                                <span className="text-sm tabular-nums text-success">
                                    {formatCurrency(totalIncome)}
                                </span>
                            </Card.Footer>
                        )}
                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title>
                                Ausgaben
                                <span className="text-default-400 ml-2 text-sm font-normal">
                                    ({expenses.length})
                                </span>
                            </Card.Title>
                        </Card.Header>
                        <Card.Content>
                            {expenses.length === 0 ? (
                                <p className="text-default-500 py-4 text-center text-sm">
                                    Keine Ausgaben in {year}.
                                </p>
                            ) : (
                                <div className="divide-divider divide-y">
                                    {expenses.map((expense) => (
                                        <div
                                            key={expense.id}
                                            className="flex items-center justify-between gap-3 py-2.5"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <LinkButton
                                                    href={editExpense(expense.id).url}
                                                    variant="tertiary"
                                                    size="sm"
                                                    className="h-auto p-0"
                                                >
                                                    {expense.name}
                                                </LinkButton>
                                                <p className="text-default-500 text-sm">
                                                    {[expense.category, formatDate(expense.date)]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </p>
                                            </div>
                                            <span className="text-sm font-medium tabular-nums">
                                                {formatCurrency(expense.price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Content>
                        {expenseCategoryTotals.length > 0 && (
                            <Card.Content className="border-divider border-t pt-3">
                                <div className="space-y-1">
                                    {expenseCategoryTotals.map(({ category, total }) => (
                                        <div
                                            key={category}
                                            className="text-default-500 flex items-center justify-between text-sm"
                                        >
                                            <span>{category}</span>
                                            <span className="tabular-nums">
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card.Content>
                        )}
                        {expenses.length > 0 && (
                            <Card.Footer className="justify-between font-semibold">
                                <span className="text-sm">Gesamt</span>
                                <span className="text-sm tabular-nums text-danger">
                                    {formatCurrency(totalExpenses)}
                                </span>
                            </Card.Footer>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
