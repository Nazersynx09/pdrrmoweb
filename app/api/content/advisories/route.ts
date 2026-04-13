import { NextResponse } from 'next/server';

// Mock database for development - will be replaced with D1
// In production, this will bind to D1 database via getDb()

interface Advisory {
  id: string;
  title: string;
  content: string;
  severity: 'info' | 'warning' | 'watch' | 'critical';
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

let advisories: Advisory[] = [
  {
    id: '1',
    title: 'Southwest Monsoon Advisory',
    content: 'The southwest monsoon season continues to affect the region. Please prepare emergency kits and know your evacuation routes.',
    severity: 'warning',
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Flood Monitoring Update',
    content: 'Flooding occurs in low-lying areas. Avoid crossing flooded roads.',
    severity: 'watch',
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// GET - Public: List active advisories
export async function GET() {
  try {
    const activeAdvisories = advisories
      .filter(a => a.is_active)
      .filter(a => {
        const validUntil = new Date(a.valid_until);
        return validUntil > new Date();
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: activeAdvisories
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch advisories' },
      { status: 500 }
    );
  }
}

// POST - Admin: Create new advisory
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, severity, valid_from, valid_until } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newAdvisory: Advisory = {
      id: Date.now().toString(),
      title,
      content,
      severity: severity || 'info',
      valid_from: valid_from || new Date().toISOString(),
      valid_until: valid_until || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
    };

    advisories.push(newAdvisory);

    return NextResponse.json({
      success: true,
      data: newAdvisory
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create advisory' },
      { status: 500 }
    );
  }
}