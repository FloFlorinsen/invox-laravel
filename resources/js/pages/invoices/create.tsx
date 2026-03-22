import { Head } from '@inertiajs/react';
import { lazy, Suspense, useState } from 'react';
import AppLayout from '@/components/app-layout';
import InvoiceForm, { type InvoiceFormData } from '@/components/invoice-form';
import LinkButton from '@/components/link-button';
import { IconArrowBack } from '@/icons';
import { index, store } from '@/routes/invoices';
import type { Contact } from '@/types';

const InvoicePreview = lazy(() => import('@/components/invoice-preview'));

interface Props {
    contacts: Contact[];
    nextNumber: string;
}

export default function InvoicesCreate({ contacts, nextNumber }: Props) {
    const [formData, setFormData] = useState<InvoiceFormData>({
        number: nextNumber,
        date: new Date().toISOString().split('T')[0],
        contact_id: '',
        items: [{ name: '', quantity: 1, price: '' }],
    });

    return (
        <AppLayout>
            <Head title="Neue Rechnung" />

            <div className="mx-auto flex max-w-7xl gap-8">
                <div className="min-w-0 flex-1">
                    <div className="mb-6 flex items-center gap-4">
                        <LinkButton href={index.url()} variant="ghost" size="sm">
                            <IconArrowBack className="size-4" /> Zurück
                        </LinkButton>
                        <h1 className="text-2xl font-bold">Neue Rechnung</h1>
                    </div>

                    <InvoiceForm
                        contacts={contacts}
                        action={store.url()}
                        method="post"
                        defaultNumber={nextNumber}
                        onDataChange={setFormData}
                    />
                </div>

                <div className="sticky top-0 hidden max-h-screen w-[min(40%,420px)] shrink-0 py-5 lg:block">
                    <Suspense>
                        <InvoicePreview formData={formData} contacts={contacts} />
                    </Suspense>
                </div>
            </div>
        </AppLayout>
    );
}
