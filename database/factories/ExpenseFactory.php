<?php

namespace Database\Factories;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'date' => fake()->dateTimeBetween('-1 year'),
            'price' => fake()->randomFloat(2, 5, 500),
            'number' => fake()->optional()->numerify('EXP-####'),
            'category' => fake()->randomElement(['Büromaterial', 'Software', 'Reisekosten', 'Hardware', 'Telefon']),
        ];
    }
}
