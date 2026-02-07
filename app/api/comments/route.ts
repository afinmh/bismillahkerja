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
