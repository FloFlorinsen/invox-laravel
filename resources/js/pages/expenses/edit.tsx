import { Head } from '@inertiajs/react'
import AppLayout from '@/components/app-layout'
import ExpenseForm from '@/components/expense-form'
import LinkButton from '@/components/link-button'
import { IconArrowBack } from '@/icons'
import { index, update } from '@/routes/expenses'
import type { Expense } from '@/types'

interface Props {
    expense: Expense
    categories: string[]
}

export default function ExpensesEdit({ expense, categories }: Props) {
    return (
        <AppLayout>
            <Head title={`${expense.name} bearbeiten`} />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center gap-4">
                    <LinkButton
                        href={index.url()}
                        variant="ghost"
                        size="sm"
                    >
                        <IconArrowBack className="size-4" /> Zurück
                    </LinkButton>
                    <h1 className="text-2xl font-bold">Ausgabe bearbeiten</h1>
                </div>

                <ExpenseForm
                    expense={expense}
                    categories={categories}
                    action={update(expense.id).url}
                    method="put"
                />
            </div>
        </AppLayout>
    )
}
