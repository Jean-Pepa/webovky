"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import type { Project } from "@/types/database";

interface SortableProjectRowProps {
  project: Project;
  locale: string;
  onDuplicate: (id: string) => void;
  duplicating: string | null;
}

export default function SortableProjectRow({ project, locale, onDuplicate, duplicating }: SortableProjectRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: '#efefef',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-black/[0.06] last:border-b-0 hover:bg-[#e8e8e8] transition-colors"
      {...attributes}
    >
      <td style={{ padding: "20px 24px", width: 40 }}>
        <span className="cursor-grab active:cursor-grabbing text-black/30 text-lg" {...listeners}>
          ⠿
        </span>
      </td>
      <td style={{ padding: "20px 24px" }}>{project.title_cs}</td>
      <td style={{ padding: "20px 24px" }} className="text-black/50">
        {project.category === "atelier" ? "Ateliérová tvorba" : "Ostatní tvorba"}
      </td>
      <td style={{ padding: "20px 24px" }}>
        <span
          className="text-lg border"
          style={{
            borderRadius: 9999,
            paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6,
            backgroundColor: project.is_published ? '#bbf7d0' : '#fecaca',
            color: project.is_published ? '#14532d' : '#dc2626',
            borderColor: project.is_published ? '#4ade80' : '#f87171',
          }}
        >
          {project.is_published ? "Publikováno" : "Nepublikováno"}
        </span>
      </td>
      <td style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <Link
            href={`/${locale}/admin/projects/${project.id}/edit`}
            className="text-black/50 hover:text-black text-[21px] transition-colors"
          >
            Upravit
          </Link>
          <button
            type="button"
            onClick={() => onDuplicate(project.id)}
            disabled={duplicating === project.id}
            className="text-black/50 hover:text-black text-[21px] transition-colors disabled:opacity-30"
          >
            {duplicating === project.id ? "..." : "Duplikovat"}
          </button>
          <DeleteButton
            endpoint={`/api/admin/projects/${project.id}`}
            confirmMessage={`Smazat projekt "${project.title_cs}"?`}
          />
        </div>
      </td>
    </tr>
  );
}
