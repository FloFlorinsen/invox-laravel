<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->firstOrCreate(
            ['email' => config('auth.owner.email')],
            [
                'name' => config('auth.owner.name'),
                'password' => config('auth.owner.password'),
            ],
        );
    }
}
