import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "";

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from("media")
    .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media`;

  const items = (data || []).map((item) => ({
    name: item.name,
    isFolder: !item.metadata,
    size: item.metadata?.size ?? 0,
    mimeType: item.metadata?.mimetype ?? "",
    createdAt: item.created_at,
    url: item.metadata ? `${bucketUrl}/${folder ? folder + "/" : ""}${item.name}` : null,
    path: `${folder ? folder + "/" : ""}${item.name}`,
  }));

  return NextResponse.json(items);
}

export async function DELETE(request: NextRequest) {
  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await request.json();
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from("media").remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
