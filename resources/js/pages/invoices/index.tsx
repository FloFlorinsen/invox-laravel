import { Head, router } from '@inertiajs/react';
import { Button, Surface } from '@heroui/react';
import { pdf } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import AppLayout from '@/components/app-layout';
import { InvoicePdf } from '@/components/invoice-pdf';
import LinkButton from '@/components/link-button';
import { create, destroy, edit } from '@/routes/invoices';
import type { Invoice } from '@/types';
import { IconAdd, IconDownload } from '@/icons';

type InvoiceWithTotal = Invoice & { total: string | null };

interface Props {
    invoices: InvoiceWithTotal[];
}

const formatCurrency = (value: string | null) =>
    Number(value ?? 0).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
    });

export default function InvoicesIndex({ invoices }: Props) {
    const handleDelete = (invoice: InvoiceWithTotal) => {
        if (confirm(`Rechnung „${invoice.number}" wirklich löschen?`)) {
            router.delete(destroy(invoice.id).url);
        }
    };

    const handleDownload = async (invoice: InvoiceWithTotal) => {
        const blob = await pdf(<InvoicePdf invoice={invoice} />).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rechnung-${invoice.number}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatDate = (date: string) => format(parseISO(date), 'dd.MM.yyyy');

    return (
        <AppLayout>
            <Head title="Rechnungen" />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Rechnungen</h1>
                    <LinkButton href={create.url()} variant="primary" size="sm">
                        <IconAdd />
                        Neue Rechnung
                    </LinkButton>
                </div>

                {invoices.length === 0 ? (
                    <p className="text-default-500 py-12 text-center">
                        Noch keine Rechnungen vorhanden.
                    </p>
                ) : (
                    <Surface className="divide-divider divide-y rounded-lg">
                        {invoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                            >
                                <div className="flex items-center justify-between sm:block">
                                    <p className="font-medium">
                                        {invoice.number}
                                    </p>
                                    <span className="text-sm font-medium tabular-nums sm:hidden">
                                        {formatCurrency(invoice.total)}
                                    </span>
                                    <p className="text-default-500 hidden text-sm sm:block">
                                        {invoice.contact.name}
                                    </p>
                                </div>
                                <p className="text-default-500 text-sm sm:hidden">
                                    {invoice.contact.name} · {formatDate(invoice.date)}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="hidden text-sm font-medium tabular-nums sm:inline">
                                        {formatCurrency(invoice.total)}
                                    </span>
                                    <span className="text-default-500 hidden text-sm sm:inline">
                                        {formatDate(invoice.date)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            isIconOnly
                                            onPress={() => handleDownload(invoice)}
                                            aria-label="PDF herunterladen"
                                        >
                                            <IconDownload className="size-4" />
                                        </Button>
                                        <LinkButton
                                            href={edit(invoice.id).url}
                                            variant="tertiary"
                                            size="sm"
                                        >
                                            Bearbeiten
                                        </LinkButton>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onPress={() =>
                                                handleDelete(invoice)
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
    );
}
