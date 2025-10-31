<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SimilarProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'similar_code',
    ];

    /**
     * Relationship: Similar code belongs to a product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
