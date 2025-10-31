<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code',
        'price',
        'brand',
        'is_bot_allowed',
        'with_price',
        'without_price',
        'description',
    ];

    /**
     * Relationship: Product has many similar codes
     */
    public function simillars()
    {
        return $this->hasMany(SimilarProduct::class, 'product_id');
    }
}
