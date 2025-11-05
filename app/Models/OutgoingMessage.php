<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutgoingMessage extends Model
{
    protected $table = 'outgoing_messages';
    protected $fillable = [
        'receiver',
        'response',
        'user_id'
    ];

    public function incoming()
    {
        return $this->belongsTo(IncomingMessage::class);
    }
}
