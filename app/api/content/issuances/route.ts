import { NextResponse } from 'next/server';

interface Issuance {
  id: string;
  title: string;
  issuance_number: string;
  issue_date: string;
  file_path: string;
  description: string;
  created_at: string;
}

let issuances: Issuance[] = [
  {
    id: '1',
    title: 'NDRRMC Memorandum No. 58, s. 2026',
    issuance_number: 'NDRRMC No. 58, s. 2026',
    issue_date: '2026-03-01',
    file_path: 'https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC-MEMO-58-s.-2026-Raising-of-the-NDRRMOC-Alert-Status-to-BLUE-ICOW-The-Observance-of-the-Holy-Week-SEMANA-SANTA-2026.pdf',
    description: 'Raising of the NDRRMOC Alert Status to BLUE ICOW the Observance of the Holy Week (SEMANA SANTA) 2026',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'NDRRMC Memorandum No. 62, s. 2026',
    issuance_number: 'NDRRMC No. 62, s. 2026',
    issue_date: '2026-03-15',
    file_path: 'https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC_Memorandum_No_62_s_2026.pdf',
    description: 'NDRRMC Memorandum regarding disaster preparedness measures',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'PDRRMC Memorandum No. 15, s. 2026',
    issuance_number: 'PDRRMC No. 15, s. 2026',
    issue_date: '2026-02-01',
    file_path: 'https://ndrrmc.gov.ph/wp-content/uploads/2026/02/NDRRMC_Memorandum_No_15_s_2026.pdf',
    description: 'Provincial DRRM memorandum for local implementation',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'NDRRMC Memorandum No. 14, s. 2025',
    issuance_number: 'NDRRMC No. 14, s. 2025',
    issue_date: '2025-01-01',
    file_path: './superTyphoonTtex.pdf',
    description: 'Super Typhoon TTEX preparedness and response guidelines',
    created_at: new Date().toISOString(),
  },
];

// GET - Public: List all issuances
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: issuances
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch issuances' },
      { status: 500 }
    );
  }
}

// POST - Admin: Create issuance
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, issuance_number, issue_date, file_path, description } = body;

    if (!title || !file_path) {
      return NextResponse.json(
        { success: false, error: 'Title and file_path are required' },
        { status: 400 }
      );
    }

    const newIssuance: Issuance = {
      id: Date.now().toString(),
      title,
      issuance_number: issuance_number || '',
      issue_date: issue_date || '',
      file_path,
      description: description || '',
      created_at: new Date().toISOString(),
    };

    issuances.push(newIssuance);

    return NextResponse.json({
      success: true,
      data: newIssuance
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create issuance' },
      { status: 500 }
    );
  }
}