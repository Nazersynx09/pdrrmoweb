import { NextResponse } from 'next/server';

interface Resource {
  id: string;
  title: string;
  description: string;
  file_path: string;
  file_type: string;
  resource_type: string;
  created_at: string;
}

let resources: Resource[] = [
  {
    id: '1',
    title: 'NDRRMC Memorandum No. 14, s.2025 - Super Typhoon TTEX',
    description: 'NDRRMC memorandum regarding Super Typhoon TTEX preparedness and response',
    file_path: './superTyphoonTtex.pdf',
    file_type: 'pdf',
    resource_type: 'memo',
    created_at: new Date().toISOString(),
  },
];

// GET - Public: List all resources
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: resources
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST - Admin: Create resource
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, file_path, file_type, resource_type } = body;

    if (!title || !file_path || !resource_type) {
      return NextResponse.json(
        { success: false, error: 'Title, file_path, and resource_type are required' },
        { status: 400 }
      );
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      title,
      description: description || '',
      file_path,
      file_type: file_type || '',
      resource_type,
      created_at: new Date().toISOString(),
    };

    resources.push(newResource);

    return NextResponse.json({
      success: true,
      data: newResource
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}