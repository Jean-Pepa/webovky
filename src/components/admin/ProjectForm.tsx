"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types/database";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import DocImageUpload from "./DocImageUpload";
import PdfUpload from "./PdfUpload";

interface ProjectFormProps {
  project?: Project;
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

export default function ProjectForm({ project, title }: ProjectFormProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";
  const isEdit = !!project;
  const pageTitle = title ?? (isEdit ? "Upravit projekt" : "Nový projekt");

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
    images: project?.images ?? [],
    pdf_files: project?.pdf_files ?? [],
    doc_images: project?.doc_images ?? [],
    doc_video: project?.doc_video ?? "",
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

    const payload = isEdit ? { id: project!.id, ...form } : form;

    try {
      const res = await fetch("/api/admin/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chyba při ukládání");
      }

      window.location.href = `/${locale}/admin/projects`;
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
              onClick={() => window.open(`/${locale}/projects/${form.slug}?preview=true`, "_blank")}
              className="border border-black/15 text-black/60 text-[21px] hover:bg-black/[0.03] transition-colors" style={{ borderRadius: 14, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}
            >
              Náhled
            </button>
          )}
          <button
            type="button"
            onClick={() => { window.location.href = `/${locale}/admin/projects`; }}
            className="border border-black/15 text-black/60 text-[21px] hover:bg-black/[0.03] transition-colors" style={{ borderRadius: 14, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}
          >
            Zrušit
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={loading}
            className="bg-black text-white text-[21px] hover:bg-black/80 transition-colors disabled:opacity-50" style={{ borderRadius: 14, paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10 }}
          >
            {loading ? "Ukládání..." : isEdit ? "Uložit" : "Vytvořit"}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="border border-black/[0.06]" style={{ borderRadius: 20, padding: 40, backgroundColor: '#efefef' }}>
        <form id="project-form" onSubmit={handleSubmit} className="max-w-[800px]">
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
            {/* Title */}
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

            {/* Slug */}
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

            {/* Category + Subcategory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                  Kategorie
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                >
                  <option value="atelier">Ateliérová tvorba</option>
                  <option value="other">Ostatní tvorba</option>
                </select>
              </div>
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                  Podkategorie
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  placeholder="např. AT-2 • Gale / Sládeček"
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
            </div>

            {/* PDF files */}
            <PdfUpload
              value={form.pdf_files}
              onChange={(files) => setForm((prev) => ({ ...prev, pdf_files: files }))}
              folder="projects/pdfs"
              label="PDF ke stažení"
            />

            {/* Description */}
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                Popis ({tab === "cs" ? "CZ" : "EN"})
              </label>
              <textarea
                name={tab === "cs" ? "description_cs" : "description_en"}
                value={tab === "cs" ? form.description_cs : form.description_en}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px] resize-y"
              />
            </div>

            {/* Detail */}
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                Detail / Markdown ({tab === "cs" ? "CZ" : "EN"})
              </label>
              <textarea
                name={tab === "cs" ? "detail_cs" : "detail_en"}
                value={tab === "cs" ? (form.detail_cs ?? "") : (form.detail_en ?? "")}
                onChange={handleChange}
                rows={8}
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px] resize-y"
              />
            </div>

            {/* Thumbnail Upload */}
            <ImageUpload
              value={form.thumbnail_url}
              onChange={(url) => setForm((prev) => ({ ...prev, thumbnail_url: url }))}
              folder="projects/thumbnails"
              label="Náhledový obrázek"
            />

            {/* Gallery Images */}
            <MultiImageUpload
              value={form.images}
              onChange={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
              folder="projects/gallery"
              label="Galerie obrázků"
            />

            {/* Documentation Images */}
            <DocImageUpload
              value={form.doc_images}
              onChange={(imgs) => setForm((prev) => ({ ...prev, doc_images: imgs }))}
              folder="projects/docs"
              label="Dokumentace (obrázky)"
            />

            {/* Documentation Video */}
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                Dokumentace (video URL)
              </label>
              <input
                type="text"
                name="doc_video"
                value={form.doc_video}
                onChange={handleChange}
                placeholder="/videos/nazev.mp4"
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
              />
            </div>

            {/* Year + Sort Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">Rok</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">
                  Pořadí řazení
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={form.sort_order}
                  onChange={handleChange}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
            </div>

            {/* Publish status */}
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-3">Stav publikace</label>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, is_published: true }))}
                  className="text-[19px] border font-medium"
                  style={{
                    borderRadius: 9999,
                    paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 8,
                    backgroundColor: form.is_published ? '#bbf7d0' : 'transparent',
                    color: form.is_published ? '#14532d' : '#999',
                    borderColor: form.is_published ? '#4ade80' : '#ddd',
                  }}
                >
                  Publikováno
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, is_published: false }))}
                  className="text-[19px] border font-medium"
                  style={{
                    borderRadius: 9999,
                    paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 8,
                    backgroundColor: !form.is_published ? '#fecaca' : 'transparent',
                    color: !form.is_published ? '#dc2626' : '#999',
                    borderColor: !form.is_published ? '#f87171' : '#ddd',
                  }}
                >
                  Nepublikováno
                </button>
              </div>
              <p className="text-[17px] text-black/40" style={{ marginTop: 8 }}>
                {form.is_published
                  ? "Projekt je viditelný na veřejném webu."
                  : "Projekt se nezobrazuje na veřejném webu, ale zůstává v adminu."}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
