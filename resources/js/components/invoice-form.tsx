import { useForm } from '@inertiajs/react';
import {
    Button,
    FieldError,
    Input,
    Label,
    ListBox,
    NumberField,
    Select,
    TextField,
} from '@heroui/react';
import CurrencyInput from 'react-currency-input-field';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { IconAdd, IconClose } from '@/icons';
import type { Contact, Invoice } from '@/types';

export interface InvoiceFormData {
    number: string;
    date: string;
    contact_id: string;
    items: ItemData[];
}

interface Props {
    invoice?: Invoice;
    contacts: Contact[];
    action: string;
    method: 'post' | 'put';
    defaultNumber?: string;
    onDataChange?: (data: InvoiceFormData) => void;
}

interface ItemData {
    name: string;
    quantity: number;
    price: string;
}

export default function InvoiceForm({
    invoice,
    contacts,
    action,
    method,
    defaultNumber,
    onDataChange,
}: Props) {
    const form = useForm({
        number: invoice?.number ?? defaultNumber ?? '',
        date: invoice?.date?.split('T')[0] ?? format(new Date(), 'yyyy-MM-dd'),
        contact_id: invoice?.contact?.id?.toString() ?? '',
        items: (invoice?.items ?? [{ name: '', quantity: 1, price: '' }]).map(
            (item) => ({
                name: item.name,
                quantity: item.quantity,
                price: String(item.price),
            }),
        ) as ItemData[],
    });

    const prevDataRef = useRef(JSON.stringify(form.data));
    useEffect(() => {
        const serialized = JSON.stringify(form.data);
        if (serialized !== prevDataRef.current) {
            prevDataRef.current = serialized;
            onDataChange?.(form.data);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (method === 'put') {
            form.put(action);
        } else {
            form.post(action);
        }
    };

    const addItem = () => {
        form.setData('items', [
            ...form.data.items,
            { name: '', quantity: 1, price: '' },
        ]);
    };

    const removeItem = (index: number) => {
        form.setData(
            'items',
            form.data.items.filter((_, i) => i !== index),
        );
    };

    const updateItem = (
        index: number,
        field: keyof ItemData,
        value: string | number,
    ) => {
        const items = [...form.data.items];
        items[index] = { ...items[index], [field]: value };
        form.setData('items', items);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextField
                    name="number"
                    isRequired
                    isInvalid={!!form.errors.number}
                    value={form.data.number}
                    onChange={(value) => form.setData('number', value)}
                >
                    <Label>Nummer</Label>
                    <Input placeholder="INV-001" autoFocus />
                    <FieldError>{form.errors.number}</FieldError>
                </TextField>

                <TextField
                    name="date"
                    type="date"
                    isRequired
                    isInvalid={!!form.errors.date}
                    value={form.data.date}
                    onChange={(value) => form.setData('date', value)}
                >
                    <Label>Datum</Label>
                    <Input />
                    <FieldError>{form.errors.date}</FieldError>
                </TextField>

                <div className="flex flex-col gap-1">
                    <Select
                        name="contact_id"
                        placeholder="Kontakt auswählen"
                        isRequired
                        isInvalid={!!form.errors.contact_id}
                        selectedKey={form.data.contact_id}
                        onSelectionChange={(key) =>
                            form.setData('contact_id', String(key))
                        }
                    >
                        <Label>Kontakt</Label>
                        <Select.Trigger>
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {contacts.map((contact) => (
                                    <ListBox.Item
                                        key={contact.id}
                                        id={String(contact.id)}
                                        textValue={contact.name}
                                    >
                                        {contact.name}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    {form.errors.contact_id && (
                        <p className="text-sm text-danger">
                            {form.errors.contact_id}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Positionen</span>
                    <Button variant="tertiary" size="sm" onPress={addItem}>
                        <IconAdd className="size-4" /> Position hinzufügen
                    </Button>
                </div>

                {form.errors.items && (
                    <p className="text-sm text-danger">{form.errors.items}</p>
                )}

                <div className="flex flex-col gap-3">
                    {form.data.items.map((item, index) => (
                        <div
                            key={index}
                            className="border-divider flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start"
                        >
                            <TextField
                                name={`items.${index}.name`}
                                isRequired
                                isInvalid={
                                    !!form.errors[
                                        `items.${index}.name` as keyof typeof form.errors
                                    ]
                                }
                                value={item.name}
                                onChange={(value) =>
                                    updateItem(index, 'name', value)
                                }
                                className="flex-1"
                            >
                                <Label>Bezeichnung</Label>
                                <Input placeholder="Bezeichnung" />
                                <FieldError>
                                    {
                                        form.errors[
                                            `items.${index}.name` as keyof typeof form.errors
                                        ]
                                    }
                                </FieldError>
                            </TextField>

                            <NumberField
                                name={`items.${index}.quantity`}
                                isRequired
                                isInvalid={
                                    !!form.errors[
                                        `items.${index}.quantity` as keyof typeof form.errors
                                    ]
                                }
                                value={item.quantity}
                                onChange={(val) =>
                                    updateItem(index, 'quantity', val)
                                }
                                minValue={1}
                                className="w-full sm:w-24"
                            >
                                <Label>Menge</Label>
                                <Input />
                                <FieldError>
                                    {
                                        form.errors[
                                            `items.${index}.quantity` as keyof typeof form.errors
                                        ]
                                    }
                                </FieldError>
                            </NumberField>

                            <div className="w-full sm:w-40">
                                <Label className="mb-1 block text-sm font-medium">
                                    Preis
                                </Label>
                                <CurrencyInput
                                    name={`items.${index}.price`}
                                    defaultValue={item.price || undefined}
                                    onValueChange={(_value, _name, values) =>
                                        updateItem(
                                            index,
                                            'price',
                                            values?.float?.toString() ?? '',
                                        )
                                    }
                                    intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
                                    decimalsLimit={2}
                                    placeholder="0,00 €"
                                    className="border-border bg-field-background text-field-foreground placeholder:text-field-placeholder focus:border-focus focus:ring-focus/30 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
                                />
                                {form.errors[
                                    `items.${index}.price` as keyof typeof form.errors
                                ] && (
                                    <p className="mt-1 text-sm text-danger">
                                        {
                                            form.errors[
                                                `items.${index}.price` as keyof typeof form.errors
                                            ]
                                        }
                                    </p>
                                )}
                            </div>

                            {form.data.items.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    isIconOnly
                                    onPress={() => removeItem(index)}
                                    aria-label="Position entfernen"
                                    className="self-end text-danger sm:mt-6 sm:self-auto"
                                >
                                    <IconClose className="size-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="submit"
                    variant="primary"
                    isPending={form.processing}
                >
                    Rechnung {invoice ? 'aktualisieren' : 'erstellen'}
                </Button>
            </div>
        </form>
    );
}
