<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DefaultMessage extends Model
{
    protected $table = 'default_messages';
    protected $fillable = [
        'user_id',
        'message'
    ];
}
