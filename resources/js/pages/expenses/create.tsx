import { Head } from '@inertiajs/react'
import AppLayout from '@/components/app-layout'
import ExpenseForm from '@/components/expense-form'
import LinkButton from '@/components/link-button'
import { IconArrowBack } from '@/icons'
import { index, store } from '@/routes/expenses'

interface Props {
    categories: string[]
}

export default function ExpensesCreate({ categories }: Props) {
    return (
        <AppLayout>
            <Head title="Neue Ausgabe" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center gap-4">
                    <LinkButton href={index.url()} variant="ghost" size="sm">
                        <IconArrowBack className="size-4" /> Zurück
                    </LinkButton>
                    <h1 className="text-2xl font-bold">Neue Ausgabe</h1>
                </div>

                <ExpenseForm
                    categories={categories}
                    action={store.url()}
                    method="post"
                />
            </div>
        </AppLayout>
    )
}
