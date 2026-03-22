import { useForm } from '@inertiajs/react';
import {
    Button,
    FieldError,
    Input,
    Label,
    TextField,
} from '@heroui/react';
import { IconAdd, IconClose } from '@/icons';
import type { Contact } from '@/types';

interface Props {
    contact?: Contact;
    action: string;
    method: 'post' | 'put';
}

export default function ContactForm({ contact, action, method }: Props) {
    const form = useForm({
        name: contact?.name ?? '',
        address_lines: contact?.address_lines ?? [''],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (method === 'put') {
            form.put(action);
        } else {
            form.post(action);
        }
    };

    const addLine = () => {
        form.setData('address_lines', [...form.data.address_lines, '']);
    };

    const removeLine = (index: number) => {
        form.setData(
            'address_lines',
            form.data.address_lines.filter((_, i) => i !== index),
        );
    };

    const updateLine = (index: number, value: string) => {
        const lines = [...form.data.address_lines];
        lines[index] = value;
        form.setData('address_lines', lines);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
                name="name"
                isRequired
                isInvalid={!!form.errors.name}
                value={form.data.name}
                onChange={(value) => form.setData('name', value)}
            >
                <Label>Name</Label>
                <Input placeholder="Firma oder Person" autoFocus />
                <FieldError>{form.errors.name}</FieldError>
            </TextField>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Adresszeilen</span>
                {form.data.address_lines.map((line, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <TextField
                            name={`address_lines.${index}`}
                            isRequired
                            isInvalid={
                                !!form.errors[
                                    `address_lines.${index}` as keyof typeof form.errors
                                ]
                            }
                            value={line}
                            onChange={(value) => updateLine(index, value)}
                            className="flex-1"
                        >
                            <Input placeholder={`Zeile ${index + 1}`} />
                            <FieldError>
                                {
                                    form.errors[
                                        `address_lines.${index}` as keyof typeof form.errors
                                    ]
                                }
                            </FieldError>
                        </TextField>
                        {form.data.address_lines.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                isIconOnly
                                onPress={() => removeLine(index)}
                                aria-label="Zeile entfernen"
                                className="text-danger mt-0.5"
                            >
                                <IconClose className="size-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    variant="tertiary"
                    size="sm"
                    onPress={addLine}
                    className="self-start"
                >
                    <IconAdd className="size-4" /> Zeile hinzufügen
                </Button>
                {form.errors.address_lines && (
                    <p className="text-danger text-sm">
                        {form.errors.address_lines}
                    </p>
                )}
            </div>

            <div className="mt-2 flex items-center gap-2">
                <Button
                    type="submit"
                    variant="primary"
                    isPending={form.processing}
                >
                    Kontakt {contact ? 'aktualisieren' : 'erstellen'}
                </Button>
            </div>
        </form>
    );
}
