<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramAccount extends Model
{
    protected $table = 'telegram_accounts';

    public function use()
    {
        return $this->belongsTo(User::class);
    }
}
