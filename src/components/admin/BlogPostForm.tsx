"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types/database";
import ImageUpload from "./ImageUpload";

interface PrefillData {
  title: string;
  content: string;
  cover: string;
  source: string;
  link: string;
}

interface BlogPostFormProps {
  post?: BlogPost;
  title?: string;
  prefill?: PrefillData;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogPostForm({ post, title, prefill }: BlogPostFormProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";
  const isEdit = !!post;
  const pageTitle = title ?? (isEdit ? "Upravit příspěvek" : "Nový příspěvek");

  const [isStory, setIsStory] = useState(!!post?.story_data);
  const [storyFields, setStoryFields] = useState({
    style: (post?.story_data?.style ?? "dark") as "dark" | "light",
    subtitle: post?.story_data?.subtitle ?? "",
    architect: post?.story_data?.architect ?? "",
    year: post?.story_data?.year ?? "",
    stat1_label: post?.story_data?.stat1_label ?? "",
    stat1_value: post?.story_data?.stat1_value ?? "",
    stat2_label: post?.story_data?.stat2_label ?? "",
    stat2_value: post?.story_data?.stat2_value ?? "",
    story_tags: post?.story_data?.tags?.join(", ") ?? "",
  });

  const [form, setForm] = useState({
    title_cs: post?.title_cs ?? prefill?.title ?? "",
    title_en: post?.title_en ?? "",
    slug: post?.slug ?? (prefill?.title ? slugify(prefill.title) : ""),
    excerpt_cs: post?.excerpt_cs ?? "",
    excerpt_en: post?.excerpt_en ?? "",
    content_cs: post?.content_cs ?? prefill?.content ?? "",
    content_en: post?.content_en ?? "",
    cover_image_url: post?.cover_image_url ?? prefill?.cover ?? "",
    tags: post?.tags?.join(", ") ?? "",
    is_published: post?.is_published ?? false,
    source: post?.source ?? prefill?.source ?? "manual",
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

    const storyData = isStory
      ? {
          style: storyFields.style,
          subtitle: storyFields.subtitle || undefined,
          architect: storyFields.architect || undefined,
          year: storyFields.year || undefined,
          stat1_label: storyFields.stat1_label || undefined,
          stat1_value: storyFields.stat1_value || undefined,
          stat2_label: storyFields.stat2_label || undefined,
          stat2_value: storyFields.stat2_value || undefined,
          tags: storyFields.story_tags
            ? storyFields.story_tags.split(",").map((t) => t.trim()).filter(Boolean)
            : undefined,
        }
      : null;

    const data = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published_at: form.is_published ? new Date().toISOString() : null,
      story_data: storyData,
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

            {/* Story toggle */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isStory}
                onChange={(e) => setIsStory(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-[21px]">Arch Story (stories formát)</span>
            </label>

            {/* Story fields */}
            {isStory && (
              <div className="border border-black/10 rounded-xl p-5 flex flex-col gap-4 bg-black/[0.02]">
                <p className="text-[17px] font-medium text-black/50 uppercase tracking-wider">Story nastavení</p>

                <div className="flex gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="story_style"
                      checked={storyFields.style === "dark"}
                      onChange={() => setStoryFields((p) => ({ ...p, style: "dark" }))}
                    />
                    <span className="text-[18px]">Dark</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="story_style"
                      checked={storyFields.style === "light"}
                      onChange={() => setStoryFields((p) => ({ ...p, style: "light" }))}
                    />
                    <span className="text-[18px]">Light</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[16px] text-black/60 mb-1">Podtitulek</label>
                    <input
                      type="text"
                      value={storyFields.subtitle}
                      onChange={(e) => setStoryFields((p) => ({ ...p, subtitle: e.target.value }))}
                      placeholder="Praha, Česko"
                      className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] text-black/60 mb-1">Architekt / Studio</label>
                    <input
                      type="text"
                      value={storyFields.architect}
                      onChange={(e) => setStoryFields((p) => ({ ...p, architect: e.target.value }))}
                      placeholder="Zaha Hadid Architects"
                      className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[16px] text-black/60 mb-1">Rok</label>
                  <input
                    type="text"
                    value={storyFields.year}
                    onChange={(e) => setStoryFields((p) => ({ ...p, year: e.target.value }))}
                    placeholder="2026"
                    className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                    style={{ maxWidth: 120 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[16px] text-black/60 mb-1">Statistika 1 — název</label>
                    <input
                      type="text"
                      value={storyFields.stat1_label}
                      onChange={(e) => setStoryFields((p) => ({ ...p, stat1_label: e.target.value }))}
                      placeholder="Plocha"
                      className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] text-black/60 mb-1">Statistika 1 — hodnota</label>
                    <input
                      type="text"
                      value={storyFields.stat1_value}
                      onChange={(e) => setStoryFields((p) => ({ ...p, stat1_value: e.target.value }))}
                      placeholder="12 000 m²"
                      className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[16px] text-black/60 mb-1">Statistika 2 — název</label>
                    <input
                      type="text"
                      value={storyFields.stat2_label}
                      onChange={(e) => setStoryFields((p) => ({ ...p, stat2_label: e.target.value }))}
                      placeholder="Cena"
                      className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] text-black/60 mb-1">Statistika 2 — hodnota</label>
                    <input
                      type="text"
                      value={storyFields.stat2_value}
                      onChange={(e) => setStoryFields((p) => ({ ...p, stat2_value: e.target.value }))}
                      placeholder="€45M"
                      className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[16px] text-black/60 mb-1">Story tagy (čárkou)</label>
                  <input
                    type="text"
                    value={storyFields.story_tags}
                    onChange={(e) => setStoryFields((p) => ({ ...p, story_tags: e.target.value }))}
                    placeholder="Muzeum, Beton, Sklo"
                    className="w-full border border-black/15 rounded-lg px-3 py-2 text-[18px]"
                  />
                </div>
              </div>
            )}

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
