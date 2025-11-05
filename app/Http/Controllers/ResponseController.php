<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ResponseController extends Controller
{
    public function index()
    {
        return Inertia::render('Response/Index');
    }
}
