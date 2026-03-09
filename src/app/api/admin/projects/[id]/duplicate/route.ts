import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const supabase = createAdminClient();

  // Fetch source project
  const { data: source, error: fetchErr } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !source) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Get max sort_order
  const { data: maxResult } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const maxOrder = maxResult?.sort_order ?? 0;

  // Generate unique slug
  let slug = `${source.slug}-copy`;
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .single();
    if (!existing) break;
    suffix++;
    slug = `${source.slug}-copy-${suffix}`;
  }

  // Copy all fields except id, created_at, updated_at
  const { id: _id, created_at: _ca, updated_at: _ua, ...fields } = source;

  const { data: newProject, error: insertErr } = await supabase
    .from("projects")
    .insert({
      ...fields,
      slug,
      is_published: false,
      sort_order: maxOrder + 1,
      title_cs: `${source.title_cs} (kopie)`,
      title_en: `${source.title_en} (copy)`,
    })
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // Log history for duplicated project
  await supabase.from("project_history").insert({
    project_id: newProject.id,
    action: "duplicated",
    changes_summary: `Duplikováno z "${source.title_cs}" (${source.slug})`,
  });

  return NextResponse.json(newProject);
}
