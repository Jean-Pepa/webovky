"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types/database";
import ImageUpload from "./ImageUpload";

interface BlogPostFormProps {
  post?: BlogPost;
  title?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogPostForm({ post, title }: BlogPostFormProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";
  const isEdit = !!post;
  const pageTitle = title ?? (isEdit ? "Upravit příspěvek" : "Nový příspěvek");

  const [form, setForm] = useState({
    title_cs: post?.title_cs ?? "",
    title_en: post?.title_en ?? "",
    slug: post?.slug ?? "",
    excerpt_cs: post?.excerpt_cs ?? "",
    excerpt_en: post?.excerpt_en ?? "",
    content_cs: post?.content_cs ?? "",
    content_en: post?.content_en ?? "",
    cover_image_url: post?.cover_image_url ?? "",
    tags: post?.tags?.join(", ") ?? "",
    is_published: post?.is_published ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"cs" | "en">("cs");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "title_cs" && !isEdit) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    const payload = isEdit ? { id: post!.id, ...data } : data;

    try {
      const res = await fetch("/api/admin/blog", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Chyba při ukládání");
      }

      window.location.href = `/${locale}/admin/blog`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neznámá chyba");
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Page header with save */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[30px] font-light tracking-wide uppercase">{pageTitle}</h1>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-[21px]">{error}</span>}
          {isEdit && (
            <button
              type="button"
              onClick={() => window.open(`/${locale}/blog/${form.slug}?preview=true`, "_blank")}
              className="border border-black/15 text-black/60 text-[21px] hover:bg-black/[0.03] transition-colors" style={{ borderRadius: 14, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}
            >
              Náhled
            </button>
          )}
          <button
            type="button"
            onClick={() => { window.location.href = `/${locale}/admin/blog`; }}
            className="border border-black/15 text-black/60 text-[21px] hover:bg-black/[0.03] transition-colors" style={{ borderRadius: 14, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}
          >
            Zrušit
          </button>
          <button
            type="submit"
            form="blog-form"
            disabled={loading}
            className="bg-black text-white text-[21px] hover:bg-black/80 transition-colors disabled:opacity-50" style={{ borderRadius: 14, paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10 }}
          >
            {loading ? "Ukládání..." : isEdit ? "Uložit" : "Vytvořit"}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="border border-black/[0.06]" style={{ borderRadius: 20, padding: 40, backgroundColor: '#efefef' }}>
        <form id="blog-form" onSubmit={handleSubmit} className="max-w-[800px]">
          {/* Language tabs */}
          <div className="flex gap-0 mb-6">
            <button
              type="button"
              onClick={() => setTab("cs")}
              className={`px-6 py-2 text-[21px] rounded-l-xl ${
                tab === "cs" ? "bg-black text-white" : "bg-black/5 text-black/60"
              }`}
            >
              Čeština
            </button>
            <button
              type="button"
              onClick={() => setTab("en")}
              className={`px-6 py-2 text-[21px] rounded-r-xl ${
                tab === "en" ? "bg-black text-white" : "bg-black/5 text-black/60"
              }`}
            >
              English
            </button>
          </div>

          <div className="flex flex-col gap-7">
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                Název ({tab === "cs" ? "CZ" : "EN"})
              </label>
              <input
                type="text"
                name={tab === "cs" ? "title_cs" : "title_en"}
                value={tab === "cs" ? form.title_cs : form.title_en}
                onChange={handleChange}
                required
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
              />
            </div>

            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
              />
            </div>

            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                Výtah ({tab === "cs" ? "CZ" : "EN"})
              </label>
              <textarea
                name={tab === "cs" ? "excerpt_cs" : "excerpt_en"}
                value={tab === "cs" ? form.excerpt_cs : form.excerpt_en}
                onChange={handleChange}
                rows={2}
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px] resize-y"
              />
            </div>

            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                Obsah / Markdown ({tab === "cs" ? "CZ" : "EN"})
              </label>
              <textarea
                name={tab === "cs" ? "content_cs" : "content_en"}
                value={tab === "cs" ? form.content_cs : form.content_en}
                onChange={handleChange}
                required
                rows={15}
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px] resize-y font-mono"
              />
            </div>

            {/* Cover Image Upload */}
            <ImageUpload
              value={form.cover_image_url}
              onChange={(url) => setForm((prev) => ({ ...prev, cover_image_url: url }))}
              folder="blog/covers"
              label="Cover obrázek"
            />

            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                Tagy (oddělené čárkou)
              </label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="architektura, design, projekt"
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-[21px]">Publikováno</span>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
