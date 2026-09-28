import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const { rows } = await db.execute('SELECT * FROM comments ORDER BY created_at ASC');
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
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

    try {
        const { rows: recentComments } = await db.execute({
            sql: 'SELECT id FROM comments WHERE id_user = ? AND created_at >= ?',
            args: [id_user, tenSecondsAgo]
        });

        if (recentComments.length > 0) {
            return NextResponse.json({ error: 'Please wait before sending another message' }, { status: 429 });
        }

        const id = crypto.randomUUID();
        const created_at = new Date().toISOString();

        await db.execute({
            sql: 'INSERT INTO comments (id, id_user, nama, message, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            args: [id, id_user, nama, message, avatar, created_at]
        });

        return NextResponse.json({ id, id_user, nama, message, avatar, created_at });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
