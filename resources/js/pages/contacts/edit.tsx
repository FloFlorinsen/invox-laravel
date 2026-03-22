import { Head } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import ContactForm from '@/components/contact-form';
import LinkButton from '@/components/link-button';
import { IconArrowBack } from '@/icons';
import { index, update } from '@/routes/contacts';
import type { Contact } from '@/types';

interface Props {
    contact: Contact;
}

export default function ContactsEdit({ contact }: Props) {
    return (
        <AppLayout>
            <Head title={`${contact.name} bearbeiten`} />

            <div className="mx-auto max-w-lg">
                <div className="mb-6 flex items-center gap-4">
                    <LinkButton
                        href={index.url()}
                        variant="ghost"
                        size="sm"
                    >
                        <IconArrowBack className="size-4" /> Zurück
                    </LinkButton>
                    <h1 className="text-2xl font-bold">Kontakt bearbeiten</h1>
                </div>

                <ContactForm
                    contact={contact}
                    action={update(contact.id).url}
                    method="put"
                />
            </div>
        </AppLayout>
    );
}
