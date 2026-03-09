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

export async function POST(request: NextRequest) {
  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("projects")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log history
  await supabase.from("project_history").insert({
    project_id: data.id,
    action: "created",
    changes_summary: `Vytvořen projekt "${data.title_cs}"`,
  });

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing project id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch existing project to merge safely (prevent accidental data wipe)
  const { data: existing } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Preserve array fields if incoming data is empty but DB has data
  const safeData = { ...updateData };
  for (const key of ["images", "doc_images", "pdf_files"] as const) {
    if (
      Array.isArray(existing[key]) &&
      existing[key].length > 0 &&
      Array.isArray(safeData[key]) &&
      safeData[key].length === 0
    ) {
      safeData[key] = existing[key];
    }
  }

  // Diff changed fields for history
  const changedFields: string[] = [];
  const trackFields = ["title_cs", "title_en", "slug", "category", "subcategory", "description_cs", "description_en", "detail_cs", "detail_en", "thumbnail_url", "year", "sort_order", "is_published", "doc_video"];
  for (const field of trackFields) {
    if (field in safeData && safeData[field] !== existing[field]) {
      changedFields.push(field);
    }
  }
  // Check array fields
  if (JSON.stringify(safeData.images) !== JSON.stringify(existing.images)) changedFields.push("images");
  if (JSON.stringify(safeData.doc_images) !== JSON.stringify(existing.doc_images)) changedFields.push("doc_images");
  if (JSON.stringify(safeData.pdf_files) !== JSON.stringify(existing.pdf_files)) changedFields.push("pdf_files");

  const { data, error } = await supabase
    .from("projects")
    .update(safeData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log history
  if (changedFields.length > 0) {
    await supabase.from("project_history").insert({
      project_id: id,
      action: "updated",
      changes_summary: changedFields.join(", "),
    });
  }

  return NextResponse.json(data);
}
