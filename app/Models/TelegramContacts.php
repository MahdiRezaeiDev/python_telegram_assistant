<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelegramContacts extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'username',
        'phone',
        'api_bot_id',
        'is_blocked',
        'profile_photo_path',
    ];

    public function blockedByUser()
    {
        return $this->hasMany(BlockedContacts::class, 'contact_id');
    }
}
