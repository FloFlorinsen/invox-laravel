import { Head, router } from '@inertiajs/react';
import { Button, Surface } from '@heroui/react';
import AppLayout from '@/components/app-layout';
import LinkButton from '@/components/link-button';
import { create, destroy, edit } from '@/routes/contacts';
import type { Contact } from '@/types';
import { IconAdd } from '@/icons';

interface Props {
    contacts: Contact[];
}

export default function ContactsIndex({ contacts }: Props) {
    const handleDelete = (contact: Contact) => {
        if (confirm(`„${contact.name}" wirklich löschen?`)) {
            router.delete(destroy(contact.id).url);
        }
    };

    return (
        <AppLayout>
            <Head title="Kontakte" />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kontakte</h1>
                    <LinkButton href={create.url()} variant="primary" size="sm">
                        <IconAdd />
                        Neuer Kontakt
                    </LinkButton>
                </div>

                {contacts.length === 0 ? (
                    <p className="text-default-500 py-12 text-center">
                        Noch keine Kontakte vorhanden.
                    </p>
                ) : (
                    <Surface className="divide-divider divide-y rounded-lg">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="flex items-center justify-between px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {contact.name}
                                    </p>
                                    <p className="text-default-500 text-sm">
                                        {contact.address_lines.join(', ')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LinkButton
                                        href={edit(contact.id).url}
                                        variant="tertiary"
                                        size="sm"
                                    >
                                        Bearbeiten
                                    </LinkButton>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onPress={() => handleDelete(contact)}
                                        className="text-danger"
                                    >
                                        Löschen
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </Surface>
                )}
            </div>
        </AppLayout>
    );
}
