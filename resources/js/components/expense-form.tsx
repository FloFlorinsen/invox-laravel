import { useForm } from '@inertiajs/react'
import {
    Button,
    ComboBox,
    FieldError,
    Input,
    Label,
    ListBox,
    TextField,
} from '@heroui/react'
import CurrencyInput from 'react-currency-input-field'
import { format } from 'date-fns'
import { useState } from 'react'
import FileInput from '@/components/file-input'
import type { Expense } from '@/types'

interface Props {
    expense?: Expense
    categories: string[]
    action: string
    method: 'post' | 'put'
}

export default function ExpenseForm({
    expense,
    categories,
    action,
    method,
}: Props) {
    const form = useForm({
        name: expense?.name ?? '',
        date: expense?.date?.split('T')[0] ?? format(new Date(), 'yyyy-MM-dd'),
        price: expense?.price ?? '',
        number: expense?.number ?? '',
        category: expense?.category ?? '',
        invoice: null as File | null,
    })

    const [categoryInputValue, setCategoryInputValue] = useState(expense?.category ?? '')

    const filteredCategories = categories.filter((cat) =>
        cat.toLowerCase().includes(categoryInputValue.toLowerCase()),
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (method === 'put') {
            form.post(action, {
                forceFormData: true,
                headers: { 'X-HTTP-Method-Override': 'PUT' },
            })
        } else {
            form.post(action, { forceFormData: true })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                    name="name"
                    isRequired
                    isInvalid={!!form.errors.name}
                    value={form.data.name}
                    onChange={(value) => form.setData('name', value)}
                >
                    <Label>Bezeichnung</Label>
                    <Input placeholder="z.B. Büromaterial" autoFocus />
                    <FieldError>{form.errors.name}</FieldError>
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
                    <Label className="text-sm font-medium">Betrag</Label>
                    <CurrencyInput
                        name="price"
                        defaultValue={expense?.price || undefined}
                        onValueChange={(_value, _name, values) =>
                            form.setData(
                                'price',
                                values?.float?.toString() ?? '',
                            )
                        }
                        intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
                        decimalsLimit={2}
                        placeholder="0,00 €"
                        className="border-border bg-field-background text-field-foreground placeholder:text-field-placeholder focus:border-focus focus:ring-focus/30 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
                    />
                    {form.errors.price && (
                        <p className="text-sm text-danger">{form.errors.price}</p>
                    )}
                </div>

                <TextField
                    name="number"
                    isInvalid={!!form.errors.number}
                    value={form.data.number}
                    onChange={(value) => form.setData('number', value)}
                >
                    <Label>Rechnungsnummer</Label>
                    <Input placeholder="z.B. RE-2026-001" />
                    <FieldError>{form.errors.number}</FieldError>
                </TextField>

                <div className="flex flex-col gap-1">
                    <ComboBox
                        allowsCustomValue
                        inputValue={categoryInputValue}
                        onInputChange={(value) => {
                            setCategoryInputValue(value)
                            form.setData('category', value)
                        }}
                        onSelectionChange={(key) => {
                            if (key !== null) {
                                const selected = String(key)
                                setCategoryInputValue(selected)
                                form.setData('category', selected)
                            }
                        }}
                        isInvalid={!!form.errors.category}
                        menuTrigger="focus"
                    >
                        <Label>Kategorie</Label>
                        <ComboBox.InputGroup>
                            <Input placeholder="z.B. Software" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <FieldError>{form.errors.category}</FieldError>
                        <ComboBox.Popover>
                            <ListBox>
                                {filteredCategories.map((cat) => (
                                    <ListBox.Item key={cat} id={cat} textValue={cat}>
                                        {cat}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </ComboBox.Popover>
                    </ComboBox>
                </div>

                <FileInput
                    label="Rechnung (Datei)"
                    onChange={(file) => form.setData('invoice', file)}
                    existingFile={!!expense?.invoice_path}
                    error={form.errors.invoice}
                />
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="submit"
                    variant="primary"
                    isPending={form.processing}
                >
                    Ausgabe {expense ? 'aktualisieren' : 'erstellen'}
                </Button>
            </div>
        </form>
    )
}
