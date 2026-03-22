import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { lazy, Suspense, useState } from 'react';
import AppLayout from '@/components/app-layout';
import InvoiceForm, { type InvoiceFormData } from '@/components/invoice-form';
import LinkButton from '@/components/link-button';
import { IconArrowBack } from '@/icons';
import { index, update } from '@/routes/invoices';
import type { Contact, Invoice } from '@/types';

const InvoicePreview = lazy(() => import('@/components/invoice-preview'));

interface Props {
    invoice: Invoice;
    contacts: Contact[];
}

export default function InvoicesEdit({ invoice, contacts }: Props) {
    const [formData, setFormData] = useState<InvoiceFormData>({
        number: invoice.number,
        date: invoice.date.split('T')[0],
        contact_id: String(invoice.contact.id),
        items: invoice.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: String(item.price),
        })),
    });

    return (
        <AppLayout>
            <Head title={`${invoice.number} bearbeiten`} />

            <div className="mx-auto flex max-w-7xl gap-8">
                <div className="min-w-0 flex-1">
                    <div className="mb-6 flex items-center gap-4">
                        <LinkButton
                            href={index.url()}
                            variant="ghost"
                            size="sm"
                        >
                            <IconArrowBack className="size-4" /> Zurück
                        </LinkButton>
                        <h1 className="text-2xl font-bold">Rechnung bearbeiten</h1>
                    </div>

                    <InvoiceForm
                        invoice={invoice}
                        contacts={contacts}
                        action={update(invoice.id).url}
                        method="put"
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
