import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
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

  const { items } = await request.json();
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = createAdminClient();

  for (const item of items) {
    await supabase
      .from("projects")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);
  }

  return NextResponse.json({ success: true });
}
