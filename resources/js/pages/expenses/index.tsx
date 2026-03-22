import { Head, router } from '@inertiajs/react'
import { Button, Surface } from '@heroui/react'
import { format, parseISO } from 'date-fns'
import AppLayout from '@/components/app-layout'
import LinkButton from '@/components/link-button'
import { create, destroy, download, edit } from '@/routes/expenses'
import type { Expense } from '@/types'
import { IconAdd, IconDownload } from '@/icons'
import { prefixUrl } from '@/utils/url'

interface Props {
    expenses: Expense[]
}

const formatCurrency = (value: string | null) =>
    Number(value ?? 0).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
    })

export default function ExpensesIndex({ expenses }: Props) {
    const handleDelete = (expense: Expense) => {
        if (confirm(`Ausgabe "${expense.name}" wirklich löschen?`)) {
            router.delete(destroy(expense.id).url)
        }
    }

    const formatDate = (date: string) => format(parseISO(date), 'dd.MM.yyyy')

    return (
        <AppLayout>
            <Head title="Ausgaben" />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ausgaben</h1>
                    <LinkButton href={create.url()} variant="primary" size="sm">
                        <IconAdd />
                        Neue Ausgabe
                    </LinkButton>
                </div>

                {expenses.length === 0 ? (
                    <p className="text-default-500 py-12 text-center">
                        Noch keine Ausgaben vorhanden.
                    </p>
                ) : (
                    <Surface className="divide-divider divide-y rounded-lg">
                        {expenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                            >
                                <div className="flex items-center justify-between sm:block">
                                    <p className="font-medium">
                                        {expense.name}
                                    </p>
                                    <span className="text-sm font-medium tabular-nums sm:hidden">
                                        {formatCurrency(expense.price)}
                                    </span>
                                    <p className="text-default-500 hidden text-sm sm:block">
                                        {[expense.category, expense.number]
                                            .filter(Boolean)
                                            .join(' · ') || '\u00A0'}
                                    </p>
                                </div>
                                <p className="text-default-500 text-sm sm:hidden">
                                    {[expense.category, expense.number, formatDate(expense.date)]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="hidden text-sm font-medium tabular-nums sm:inline">
                                        {formatCurrency(expense.price)}
                                    </span>
                                    <span className="text-default-500 hidden text-sm sm:inline">
                                        {formatDate(expense.date)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {expense.invoice_path && (
                                            <a
                                                href={prefixUrl(download(expense.id).url)}
                                                className="text-default-500 hover:text-foreground transition-colors"
                                                aria-label="Rechnung herunterladen"
                                            >
                                                <IconDownload className="size-5" />
                                            </a>
                                        )}
                                        <LinkButton
                                            href={edit(expense.id).url}
                                            variant="tertiary"
                                            size="sm"
                                        >
                                            Bearbeiten
                                        </LinkButton>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onPress={() =>
                                                handleDelete(expense)
                                            }
                                            className="text-danger"
                                        >
                                            Löschen
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Surface>
                )}
            </div>
        </AppLayout>
    )
}
