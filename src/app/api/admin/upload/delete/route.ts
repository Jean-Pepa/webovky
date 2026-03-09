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

  const { path } = await request.json();

  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from("media")
    .remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
