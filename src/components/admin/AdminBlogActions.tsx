"use client";

import { useState } from "react";
import Link from "next/link";
import RssImportModal from "./RssImportModal";

interface AdminBlogActionsProps {
  locale: string;
}

export default function AdminBlogActions({ locale }: AdminBlogActionsProps) {
  const [showRss, setShowRss] = useState(false);

  function handleImport(item: { title: string; link: string; description: string; image: string | null }) {
    // Navigate to new blog post form with pre-filled data via query params
    const params = new URLSearchParams({
      title: item.title,
      content: item.description,
      cover: item.image ?? "",
      source: "rss",
      link: item.link,
    });
    window.location.href = `/${locale}/admin/blog/new?${params.toString()}`;
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => setShowRss(true)}
          className="border border-black/[0.06] text-[21px] hover:shadow-sm transition-shadow"
          style={{ borderRadius: 20, paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, backgroundColor: '#efefef' }}
        >
          Import z ArchDaily
        </button>
        <Link
          href={`/${locale}/admin/blog/new`}
          className="border border-black/[0.06] text-[21px] hover:shadow-sm transition-shadow"
          style={{ borderRadius: 20, paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, backgroundColor: '#efefef' }}
        >
          + Přidat příspěvek
        </Link>
      </div>

      {showRss && (
        <RssImportModal
          onClose={() => setShowRss(false)}
          onImport={handleImport}
        />
      )}
    </>
  );
}
