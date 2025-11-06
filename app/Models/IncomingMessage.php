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

    public function outgoing()
    {
        return $this->hasMany(OutgoingMessage::class, 'message_id');
    }

    public function sender()
    {
        return $this->belongsTo(TelegramContacts::class, 'sender', 'api_bot_id');
    }
}
