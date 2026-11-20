import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "../_auth";

const hazardMapTypes = [
  "flood",
  "landslide",
  "liquefaction",
  "earthquake",
  "storm_surge",
  "tsunami",
] as const;

type HazardMapType = (typeof hazardMapTypes)[number];

interface HazardMapUpdates {
  title?: string;
  type?: HazardMapType;
  file_url?: string;
  thumbnail?: string;
  description?: string;
  is_active?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHazardMapType(value: unknown): value is HazardMapType {
  return (
    typeof value === "string" &&
    hazardMapTypes.includes(value as HazardMapType)
  );
}

function normalizeHazardMapType(value: unknown): HazardMapType | null {
  const normalizedValue = value === "Liquefaction" ? "liquefaction" : value;
  return isHazardMapType(normalizedValue) ? normalizedValue : null;
}

function isValidImageUrl(value: string, allowEmpty = false) {
  if (!value) return allowEmpty;
  if (value.startsWith("/") && !value.startsWith("//")) return true;

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
    .from("hazard_maps")
    .select("*")
    .order("created_at", { ascending: false });

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
  if (!isRecord(body)) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { title, type = "flood", file_url, thumbnail, description, is_active } =
    body;
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json(
      { success: false, error: "Title is required" },
      { status: 400 },
    );
  }
  const normalizedType = normalizeHazardMapType(type);
  if (!normalizedType) {
    return NextResponse.json(
      { success: false, error: "Invalid hazard map type" },
      { status: 400 },
    );
  }
  if (typeof file_url !== "string" || !isValidImageUrl(file_url.trim())) {
    return NextResponse.json(
      { success: false, error: "A valid map image URL is required" },
      { status: 400 },
    );
  }
  if (
    thumbnail !== undefined &&
    (typeof thumbnail !== "string" ||
      !isValidImageUrl(thumbnail.trim(), true))
  ) {
    return NextResponse.json(
      { success: false, error: "Thumbnail must be a URL or public path" },
      { status: 400 },
    );
  }
  if (description !== undefined && typeof description !== "string") {
    return NextResponse.json(
      { success: false, error: "Description must be text" },
      { status: 400 },
    );
  }
  if (is_active !== undefined && typeof is_active !== "boolean") {
    return NextResponse.json(
      { success: false, error: "is_active must be a boolean" },
      { status: 400 },
    );
  }

  const { data, error } = await client
    .from("hazard_maps")
    .insert({
      title: title.trim(),
      type: normalizedType,
      file_url: file_url.trim(),
      thumbnail: typeof thumbnail === "string" ? thumbnail.trim() : "",
      description: typeof description === "string" ? description.trim() : "",
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
  if (!isRecord(body) || typeof body.id !== "string" || !body.id) {
    return NextResponse.json(
      { success: false, error: "A valid map ID is required" },
      { status: 400 },
    );
  }

  const updates: HazardMapUpdates = {};
  if ("title" in body) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title cannot be empty" },
        { status: 400 },
      );
    }
    updates.title = body.title.trim();
  }
  if ("type" in body) {
    const type = normalizeHazardMapType(body.type);
    if (!type) {
      return NextResponse.json(
        { success: false, error: "Invalid hazard map type" },
        { status: 400 },
      );
    }
    updates.type = type;
  }
  if ("file_url" in body) {
    if (
      typeof body.file_url !== "string" ||
      !isValidImageUrl(body.file_url.trim())
    ) {
      return NextResponse.json(
        { success: false, error: "A valid map image URL is required" },
        { status: 400 },
      );
    }
    updates.file_url = body.file_url.trim();
  }
  if ("thumbnail" in body) {
    if (
      typeof body.thumbnail !== "string" ||
      !isValidImageUrl(body.thumbnail.trim(), true)
    ) {
      return NextResponse.json(
        { success: false, error: "Thumbnail must be a URL or public path" },
        { status: 400 },
      );
    }
    updates.thumbnail = body.thumbnail.trim();
  }
  if ("description" in body) {
    if (typeof body.description !== "string") {
      return NextResponse.json(
        { success: false, error: "Description must be text" },
        { status: 400 },
      );
    }
    updates.description = body.description.trim();
  }
  if ("is_active" in body) {
    if (typeof body.is_active !== "boolean") {
      return NextResponse.json(
        { success: false, error: "is_active must be a boolean" },
        { status: 400 },
      );
    }
    updates.is_active = body.is_active;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "No hazard map fields to update" },
      { status: 400 },
    );
  }

  const { data, error } = await client
    .from("hazard_maps")
    .update(updates)
    .eq("id", body.id)
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

  const { error } = await client.from("hazard_maps").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}
