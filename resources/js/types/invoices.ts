export interface BaseModel {
    id: number;
}

export interface Contact extends BaseModel {
    name: string;
    address_lines: string[];
}

export interface InvoiceItem extends BaseModel {
    name: string;
    quantity: number;
    price: string;
}

export interface Invoice extends BaseModel {
    number: string;
    date: string;
    contact: Contact;
    items: InvoiceItem[];
}

export interface Expense extends BaseModel {
    name: string;
    date: string;
    price: string;
    number: string | null;
    category: string | null;
    invoice_path: string | null;
}
