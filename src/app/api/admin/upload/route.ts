import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // Verify JWT
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Parse multipart form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Generate unique filename
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  const filePath = `${folder}/${timestamp}-${safeName}.${ext}`;

  const supabase = createAdminClient();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from("media")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("media")
    .getPublicUrl(filePath);

  return NextResponse.json({
    url: urlData.publicUrl,
    path: filePath,
  });
}
