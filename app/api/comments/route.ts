import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { id_user, nama, message, avatar } = body;

    if (!id_user || !nama || !message || !avatar) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Backend length validation
    if (nama.trim().length > 30) {
        return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
    }

    if (message.trim().length > 300) {
        return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    // Backend profanity filter
    const badWords = [
        'anjing', 'goblok', 'bangsat', 'babi', 'kunyuk', 'asu', 'bajingan', 'tolol',
        'idiot', 'kontol', 'memek', 'ngentot', 'brengsek', 'kampret', 'keparat', "kntl", "mmk",
        'setan', 'iblis', 'sialan', 'pecundang', 'tai', 'bacot', 'lonte', 'pelacur', 'bego', 'gila', 'bangke',
        'fuck', 'shit', 'bitch', 'ass', 'dick', 'bastard', 'crap', 'jerk',
        'idiot', 'moron', 'stupid', 'dumb', 'slut', 'whore', 'damn',
        'asshole', 'fucker', 'bullshit', 'loser', 'screw', 'nuts', 'prick',
        'penis', 'vagina', 'tit', 'boob', 'pussy', 'cock', 'cunt', 'peler', 'pepek'
    ];

    const lowerName = nama.toLowerCase();
    const lowerMsg = message.toLowerCase();

    const hasBadWord = badWords.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerMsg) || regex.test(lowerName);
    });

    if (hasBadWord) {
        return NextResponse.json({ error: 'Inappropriate content detected' }, { status: 400 });
    }

    // Basic Rate Limiting per User ID (check if user posted in last 10 seconds)
    const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();

    const { data: recentComments, error: fetchError } = await supabase
        .from('comments')
        .select('id')
        .eq('id_user', id_user)
        .gte('created_at', tenSecondsAgo);

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (recentComments && recentComments.length > 0) {
        return NextResponse.json({ error: 'Please wait before sending another message' }, { status: 429 });
    }

    const { data, error } = await supabase
        .from('comments')
        .insert([
            { id_user, nama, message, avatar }
        ])
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
}
