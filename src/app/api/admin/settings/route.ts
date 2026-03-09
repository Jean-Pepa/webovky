import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(request: NextRequest) {
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

  const body = await request.json();
  const supabase = createAdminClient();

  // Site settings is a single row
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "No site_settings row found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
