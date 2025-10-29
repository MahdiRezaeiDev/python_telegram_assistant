<?php

namespace App\Http\Controllers;

use App\Models\BlockedContacts;
use App\Models\TelegramContacts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ContactsController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $user = Auth::user();

        // Get all contacts
        $contacts = TelegramContacts::select('id', 'full_name', 'phone', 'username', 'profile_photo_path', 'api_bot_id')->get();

        // Get blocked contacts by current user
        $blockedIds = BlockedContacts::where('user_id', $user->id)->pluck('contact_id')->toArray();

        // Add "is_blocked" property
        $contacts = $contacts->map(function ($contact) use ($blockedIds) {
            $contact->is_blocked = in_array($contact->id, $blockedIds);
            return $contact;
        });

        return inertia('Contacts/Index', [
            'contacts' => $contacts
        ]);
    }

    public function toggleBlock(Request $request)
    {
        $user = Auth::user();
        $contactId = $request->contact_id;

        $blocked = BlockedContacts::where('user_id', $user->id)
            ->where('contact_id', $contactId)
            ->first();

        if ($blocked) {
            $blocked->delete();
            $status = false;
        } else {
            BlockedContacts::create([
                'user_id' => $user->id,
                'contact_id' => $contactId,
            ]);
            $status = true;
        }

        return response()->json(['blocked' => $status]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function getContacts()
    {
        $response = Http::post('http://127.0.0.1:5000/api/telegram/group-members', [
            'user_id' => Auth::id(),
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch contacts'], 500);
        }

        // Decode JSON response
        $data = $response->json();

        // Assuming your Flask API returns something like:
        // { "members": [ { "id": 123, "first_name": "...", "username": "...", ... }, ... ] }
        $members = $data['members'] ?? [];

        foreach ($members as $member) {
            TelegramContacts::updateOrCreate(
                ['api_bot_id' => $member['id']], // unique field
                [
                    'full_name'   => $member['full_name'] ?? null,
                    'username'     => $member['username'] ?? null,
                    'phone'     => $member['phone'] ?? null,
                    'profile_photo_path' => $member['profile_photo'] ?? null,
                ]
            );
        }

        return redirect()->back()->with(['status' => 'ok', 'count' => count($members)]);
    }
}
