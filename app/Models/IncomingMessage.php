<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncomingMessage extends Model
{
    protected $table = 'incoming_messages';
    protected $fillable = [
        'receiver',
        'message',
        'is_resolved'
    ];
}
