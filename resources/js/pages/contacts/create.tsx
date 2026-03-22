import { Head } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import ContactForm from '@/components/contact-form';
import LinkButton from '@/components/link-button';
import { IconArrowBack } from '@/icons';
import { index, store } from '@/routes/contacts';

export default function ContactsCreate() {
    return (
        <AppLayout>
            <Head title="Neuer Kontakt" />

            <div className="mx-auto max-w-lg">
                <div className="mb-6 flex items-center gap-4">
                    <LinkButton
                        href={index.url()}
                        variant="ghost"
                        size="sm"
                    >
                        <IconArrowBack className="size-4" /> Zurück
                    </LinkButton>
                    <h1 className="text-2xl font-bold">Neuer Kontakt</h1>
                </div>

                <ContactForm action={store.url()} method="post" />
            </div>
        </AppLayout>
    );
}
