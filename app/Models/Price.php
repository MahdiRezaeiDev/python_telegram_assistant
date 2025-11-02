<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'seller_id',
        'user_id',
        'code_name',
        'price'
    ];
}
