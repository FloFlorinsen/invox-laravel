import { usePDF } from '@react-pdf/renderer';
import { useEffect, useMemo, useRef } from 'react';
import { InvoicePdf } from '@/components/invoice-pdf';
import type { InvoiceFormData } from '@/components/invoice-form';
import type { Contact, Invoice } from '@/types';

interface Props {
    formData: InvoiceFormData
    contacts: Contact[]
}

export default function InvoicePreview({ formData, contacts }: Props) {
    const invoice = useMemo((): Invoice => {
        const contact = contacts.find(
            (c) => String(c.id) === formData.contact_id,
        ) ?? { id: 0, name: '', address_lines: [] };

        return {
            id: 0,
            number: formData.number || '–',
            date: formData.date || new Date().toISOString(),
            contact,
            items: formData.items.map((item, i) => ({
                id: i,
                name: item.name || '–',
                quantity: item.quantity || 0,
                price: item.price || '0',
            })),
        };
    }, [formData, contacts]);

    const document = useMemo(
        () => <InvoicePdf invoice={invoice} />,
        [invoice],
    );

    const [instance, update] = usePDF({ document });
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        update(document);
    }, [document, update]);

    if (instance.loading || !instance.url) {
        return (
            <div className="bg-default-100 flex aspect-[1/1.4142] w-full animate-pulse items-center justify-center rounded-lg">
                <span className="text-default-400 text-sm">Vorschau wird geladen…</span>
            </div>
        );
    }

    return (
        <object
            data={instance.url}
            type="application/pdf"
            className="aspect-[1/1.4142] w-full rounded-lg"
            aria-label="Rechnungsvorschau"
        >
            <p className="text-default-500 text-sm">
                PDF-Vorschau kann nicht angezeigt werden.
            </p>
        </object>
    );
}
