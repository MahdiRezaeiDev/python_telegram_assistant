<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telegram_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 255);
            $table->string('username', 255);
            $table->string('phone', 20);
            $table->string('api_bot_id', 255);
            $table->string('profile_photo_path', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_users');
    }
};
