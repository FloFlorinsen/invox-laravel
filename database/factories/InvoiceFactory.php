<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number' => date('Y').'-'.fake()->unique()->numerify('###'),
            'date' => fake()->dateTimeBetween('-1 year'),
            'contact_id' => Contact::factory(),
        ];
    }
}
