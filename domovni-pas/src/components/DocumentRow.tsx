import { IconFile, IconDownload, IconTrash } from "@/components/Icons";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { deleteDocument } from "@/lib/actions/document";
import { DOCUMENT_CATEGORIES, type DocumentCategory } from "@/lib/enums";
import { formatFileSize } from "@/lib/format";

type Doc = {
  id: string;
  title: string;
  category: string;
  fileName: string;
  storageKey: string;
  size: number;
};

export function DocumentRow({ doc, canEdit }: { doc: Doc; canEdit: boolean }) {
  const category =
    DOCUMENT_CATEGORIES[doc.category as DocumentCategory] ?? DOCUMENT_CATEGORIES.OTHER;

  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500">
        <IconFile className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-800">{doc.title}</p>
        <p className="text-xs text-stone-400">
          {category} · {formatFileSize(doc.size)}
        </p>
      </div>
      <a
        href={`/api/files/${doc.id}`}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost btn-sm text-stone-500"
        title="Stáhnout"
      >
        <IconDownload className="h-4 w-4" />
      </a>
      {canEdit && (
        <form action={deleteDocument}>
          <input type="hidden" name="id" value={doc.id} />
          <ConfirmSubmit
            message="Opravdu smazat tento dokument?"
            className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
          >
            <IconTrash className="h-4 w-4" />
          </ConfirmSubmit>
        </form>
      )}
    </li>
  );
}
