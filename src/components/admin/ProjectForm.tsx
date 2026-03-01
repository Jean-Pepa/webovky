"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/database";

interface ProjectFormProps {
  project?: Project;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;

  const [form, setForm] = useState({
    title_cs: project?.title_cs ?? "",
    title_en: project?.title_en ?? "",
    slug: project?.slug ?? "",
    category: project?.category ?? "atelier",
    subcategory: project?.subcategory ?? "",
    description_cs: project?.description_cs ?? "",
    description_en: project?.description_en ?? "",
    detail_cs: project?.detail_cs ?? "",
    detail_en: project?.detail_en ?? "",
    thumbnail_url: project?.thumbnail_url ?? "",
    year: project?.year ?? new Date().getFullYear(),
    sort_order: project?.sort_order ?? 0,
    is_published: project?.is_published ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"cs" | "en">("cs");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
      };
      // Auto-generate slug from Czech title
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

    if (isEdit) {
      const { error } = await supabase
        .from("projects")
        .update(form)
        .eq("id", project!.id);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from("projects").insert(form);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.push("/admin/projects");
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
        {/* Title */}
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

        {/* Slug */}
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

        {/* Category + Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-secondary mb-1">
              Kategorie
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-border px-4 py-3 text-sm"
            >
              <option value="atelier">Ateliérová tvorba</option>
              <option value="other">Ostatní tvorba</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-secondary mb-1">
              Podkategorie
            </label>
            <input
              type="text"
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              placeholder="např. AT-2 • Gale / Sládeček"
              className="w-full border border-border px-4 py-3 text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-secondary mb-1">
            Popis ({tab === "cs" ? "CZ" : "EN"})
          </label>
          <textarea
            name={tab === "cs" ? "description_cs" : "description_en"}
            value={tab === "cs" ? form.description_cs : form.description_en}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-border px-4 py-3 text-sm resize-y"
          />
        </div>

        {/* Detail */}
        <div>
          <label className="block text-sm text-secondary mb-1">
            Detail / Markdown ({tab === "cs" ? "CZ" : "EN"})
          </label>
          <textarea
            name={tab === "cs" ? "detail_cs" : "detail_en"}
            value={tab === "cs" ? (form.detail_cs ?? "") : (form.detail_en ?? "")}
            onChange={handleChange}
            rows={8}
            className="w-full border border-border px-4 py-3 text-sm resize-y"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm text-secondary mb-1">
            Thumbnail URL
          </label>
          <input
            type="text"
            name="thumbnail_url"
            value={form.thumbnail_url}
            onChange={handleChange}
            placeholder="/images/projekt.jpg"
            className="w-full border border-border px-4 py-3 text-sm"
          />
        </div>

        {/* Year + Sort Order */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-secondary mb-1">Rok</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full border border-border px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-secondary mb-1">
              Pořadí řazení
            </label>
            <input
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
              className="w-full border border-border px-4 py-3 text-sm"
            />
          </div>
        </div>

        {/* Published */}
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
              : "Vytvořit projekt"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="border border-border px-8 py-3 text-sm hover:bg-bg-light transition-colors"
          >
            Zrušit
          </button>
        </div>
      </div>
    </form>
  );
}
