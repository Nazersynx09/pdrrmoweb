import { NextResponse } from 'next/server';

interface HazardMap {
  id: string;
  name: string;
  description: string;
  category: string;
  file_path: string;
  thumbnail: string;
  region: string;
  created_at: string;
}

let hazardMaps: HazardMap[] = [
  {
    id: '1',
    name: 'Flood Hazard Map',
    description: 'Flood risk zones across Iloilo Province',
    category: 'flood',
    file_path: '/floodingHazard.tif',
    thumbnail: '',
    region: 'Iloilo Province',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Storm Surge Hazard Map',
    description: 'Coastal storm surge susceptibility areas',
    category: 'storm_surge',
    file_path: '/stormSurgeHazard.tif',
    thumbnail: '',
    region: 'Iloilo Province',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Rain Induced Landslide Map',
    description: 'Landslide-prone zones and evacuation routes',
    category: 'landslide',
    file_path: '/rainInducedLandslide.tif',
    thumbnail: '',
    region: 'Iloilo Province',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Tsunami Hazard Map',
    description: 'Tsunami risk zones across Iloilo Province',
    category: 'tsunami',
    file_path: '/Tsunami.tif',
    thumbnail: '',
    region: 'Iloilo Province',
    created_at: new Date().toISOString(),
  },
];

// GET - Public: List all hazard maps
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: hazardMaps
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hazard maps' },
      { status: 500 }
    );
  }
}

// POST - Admin: Create hazard map
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, file_path, region } = body;

    if (!name || !category || !file_path) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and file_path are required' },
        { status: 400 }
      );
    }

    const newMap: HazardMap = {
      id: Date.now().toString(),
      name,
      description: description || '',
      category,
      file_path,
      thumbnail: '',
      region: region || 'Iloilo Province',
      created_at: new Date().toISOString(),
    };

    hazardMaps.push(newMap);

    return NextResponse.json({
      success: true,
      data: newMap
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create hazard map' },
      { status: 500 }
    );
  }
}