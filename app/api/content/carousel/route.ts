import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Public: active slides ordered for display
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('carousel_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch carousel slides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch carousel slides' },
      { status: 500 }
    );
  }
}