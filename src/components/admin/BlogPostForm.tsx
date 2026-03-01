"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BlogPost } from "@/types/database";

interface BlogPostFormProps {
  post?: BlogPost;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = !!post;

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

    const supabase = createClient();
    const data = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    if (isEdit) {
      const { error } = await supabase
        .from("blog_posts")
        .update(data)
        .eq("id", post!.id);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(data);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[800px]">
      {/* Language tabs */}
      <div className="flex gap-0 mb-6">
        <button
          type="button"
          onClick={() => setTab("cs")}
          className={`px-6 py-2 text-sm ${
            tab === "cs" ? "bg-accent text-white" : "bg-white text-primary"
          }`}
        >
          Čeština
        </button>
        <button
          type="button"
          onClick={() => setTab("en")}
          className={`px-6 py-2 text-sm ${
            tab === "en" ? "bg-accent text-white" : "bg-white text-primary"
          }`}
        >
          English
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm text-secondary mb-1">
            Název ({tab === "cs" ? "CZ" : "EN"})
          </label>
          <input
            type="text"
            name={tab === "cs" ? "title_cs" : "title_en"}
            value={tab === "cs" ? form.title_cs : form.title_en}
            onChange={handleChange}
            required
            className="w-full border border-border px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-secondary mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full border border-border px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-secondary mb-1">
            Výtah ({tab === "cs" ? "CZ" : "EN"})
          </label>
          <textarea
            name={tab === "cs" ? "excerpt_cs" : "excerpt_en"}
            value={tab === "cs" ? form.excerpt_cs : form.excerpt_en}
            onChange={handleChange}
            rows={2}
            className="w-full border border-border px-4 py-3 text-sm resize-y"
          />
        </div>

        <div>
          <label className="block text-sm text-secondary mb-1">
            Obsah / Markdown ({tab === "cs" ? "CZ" : "EN"})
          </label>
          <textarea
            name={tab === "cs" ? "content_cs" : "content_en"}
            value={tab === "cs" ? form.content_cs : form.content_en}
            onChange={handleChange}
            required
            rows={15}
            className="w-full border border-border px-4 py-3 text-sm resize-y font-mono"
          />
        </div>

        <div>
          <label className="block text-sm text-secondary mb-1">
            Cover Image URL
          </label>
          <input
            type="text"
            name="cover_image_url"
            value={form.cover_image_url}
            onChange={handleChange}
            className="w-full border border-border px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-secondary mb-1">
            Tagy (oddělené čárkou)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="architektura, design, projekt"
            className="w-full border border-border px-4 py-3 text-sm"
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
          <span className="text-sm">Publikováno</span>
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-8 py-3 text-sm uppercase tracking-[1px] hover:bg-primary transition-colors disabled:opacity-50"
          >
            {loading
              ? "Ukládání..."
              : isEdit
              ? "Uložit změny"
              : "Vytvořit příspěvek"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="border border-border px-8 py-3 text-sm hover:bg-bg-light transition-colors"
          >
            Zrušit
          </button>
        </div>
      </div>
    </form>
  );
}
