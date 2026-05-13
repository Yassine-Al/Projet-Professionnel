<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($userId, $annonceId)
    {
        $messages = Message::where('annonce_id', $annonceId)
            ->where(function ($query) use ($userId) {
                $query->where(function ($q) use ($userId) {
                    $q->where('sender_id', auth()->id())
                    ->where('receiver_id', $userId);
                })->orWhere(function ($q) use ($userId) {
                    $q->where('sender_id', $userId)
                    ->where('receiver_id', auth()->id());
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
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
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'annonce_id' => 'required|exists:annonces,id',
            'content' => 'required|string'
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->input('receiver_id'),
            'annonce_id' => $request->input('annonce_id'),
            'content' => $request->input('content'),
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        $message = Message::findOrFail($message->id);

        if ($message->sender_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message deleted'
        ]);
    }

    public function inbox()
    {
        $userId = auth()->id();

        $messages = Message::with(['sender', 'receiver', 'annonce'])
            ->where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->unique(function ($msg) use ($userId) {
                return $msg->annonce_id . '-' . 
                    ($msg->sender_id == $userId ? $msg->receiver_id : $msg->sender_id);
            });

        return response()->json($messages);
    }

    public function sent()
    {
        $messages = Message::with(['receiver', 'annonce'])
            ->where('sender_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }
}
