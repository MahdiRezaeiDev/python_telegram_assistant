<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('similar_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('similar_code');
            $table->timestamps();

            $table->unique(['product_id', 'similar_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('similar_products');
    }
};
