import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const {data, error} = await supabase
    .from('resources')
    .select('id, title, category, file_url, file_type, description, created_at')
    .eq('is_active', true)
    .order('created_at', {ascending: false});

  if (error) {
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }

  return NextResponse.json({success: true, data});
}
