"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import type { Project } from "@/types/database";
import SortableProjectRow from "./SortableProjectRow";

interface ProjectsTableProps {
  initialProjects: Project[];
}

export default function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);

    setProjects(reordered);

    const items = reordered.map((p, i) => ({ id: p.id, sort_order: i }));
    await fetch("/api/admin/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  }

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}/duplicate`, { method: "POST" });
      if (res.ok) {
        const newProject = await res.json();
        window.location.href = `/${locale}/admin/projects/${newProject.id}/edit`;
      }
    } finally {
      setDuplicating(null);
    }
  }

  const projectIds = projects.map((p) => p.id);

  return (
    <div className="border border-black/[0.06] overflow-hidden" style={{ borderRadius: 20, backgroundColor: '#efefef' }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
          <table className="w-full text-[21px]">
            <thead>
              <tr className="border-b border-black/[0.06] text-left" style={{ backgroundColor: '#e8e8e8' }}>
                <th style={{ padding: "16px 24px", width: 40 }} className="text-[17px] font-medium uppercase tracking-wider text-black/50"></th>
                <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Název</th>
                <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Kategorie</th>
                <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Stav</th>
                <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Akce</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <SortableProjectRow
                  key={project.id}
                  project={project}
                  locale={locale}
                  onDuplicate={handleDuplicate}
                  duplicating={duplicating}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
