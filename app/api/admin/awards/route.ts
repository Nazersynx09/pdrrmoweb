import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "../_auth";

interface AwardUpdate {
  year?: number;
  category?: string;
  name?: string;
  region?: string;
  class_rating?: string;
  scan_url?: string;
  is_active?: boolean;
}

function isValidYear(year: unknown): year is number {
  return Number.isInteger(year) && Number(year) >= 1900 && Number(year) <= 2200;
}

function isValidScanUrl(value: string) {
  if (!value) return true;
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { data, error } = await client
    .from("office_awards")
    .select("*")
    .order("year", { ascending: false })
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { year, category, name, region, class_rating, scan_url, is_active } = body;
  if (
    !isValidYear(year) ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof name !== "string" ||
    !name.trim()
  ) {
    return NextResponse.json(
      { success: false, error: "Year, category, and name are required" },
      { status: 400 },
    );
  }
  if (
    scan_url !== undefined &&
    (typeof scan_url !== "string" || !isValidScanUrl(scan_url.trim()))
  ) {
    return NextResponse.json(
      { success: false, error: "Scan URL must be a valid HTTP or HTTPS URL" },
      { status: 400 },
    );
  }

  const { data, error } = await client
    .from("office_awards")
    .insert({
      year,
      category: category.trim(),
      name: name.trim(),
      region: typeof region === "string" ? region.trim() : "",
      class_rating:
        typeof class_rating === "string" ? class_rating.trim() : "",
      scan_url: typeof scan_url === "string" ? scan_url.trim() || null : null,
      is_active: typeof is_active === "boolean" ? is_active : true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true, data });
}

export async function PUT(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { id, ...values } = body;
  if (!id) {
    return NextResponse.json(
      { success: false, error: "ID is required" },
      { status: 400 },
    );
  }

  const updates: AwardUpdate = {};
  if ("year" in values) {
    if (!isValidYear(values.year)) {
      return NextResponse.json(
        { success: false, error: "Year must be between 1900 and 2200" },
        { status: 400 },
      );
    }
    updates.year = values.year;
  }
  for (const field of ["category", "name", "region", "class_rating", "scan_url"] as const) {
    if (field in values) {
      if (typeof values[field] !== "string") {
        return NextResponse.json(
          { success: false, error: `${field} must be a string` },
          { status: 400 },
        );
      }
      if (
        (field === "category" || field === "name") &&
        !values[field].trim()
      ) {
        return NextResponse.json(
          { success: false, error: `${field} cannot be empty` },
          { status: 400 },
        );
      }
      if (field === "scan_url" && !isValidScanUrl(values[field].trim())) {
        return NextResponse.json(
          { success: false, error: "Scan URL must be a valid HTTP or HTTPS URL" },
          { status: 400 },
        );
      }
      updates[field] = values[field].trim();
    }
  }
  if ("is_active" in values) {
    if (typeof values.is_active !== "boolean") {
      return NextResponse.json(
        { success: false, error: "is_active must be a boolean" },
        { status: 400 },
      );
    }
    updates.is_active = values.is_active;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "No award fields to update" },
      { status: 400 },
    );
  }

  const { data, error } = await client
    .from("office_awards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { success: false, error: "ID is required" },
      { status: 400 },
    );
  }

  const { error } = await client
    .from("office_awards")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}
