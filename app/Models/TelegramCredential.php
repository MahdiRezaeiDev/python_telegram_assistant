<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelegramCredential extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'api_id',
        'api_hash',
        'session_file',
        'connected'
    ];
}
