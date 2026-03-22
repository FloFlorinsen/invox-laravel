<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('invoices', 'number')->ignore($this->route('invoice')),
            ],
            'date' => ['required', 'date'],
            'contact_id' => ['required', 'exists:contacts,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
        ];
    }
}
