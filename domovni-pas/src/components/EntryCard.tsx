import { Badge } from "@/components/ui/Badge";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { AttachmentThumb } from "@/components/AttachmentThumb";
import { IconMoney, IconTrash } from "@/components/Icons";
import { deleteEntry } from "@/lib/actions/entry";
import { ENTRY_TYPES, ENTRY_TYPE_COLORS, type EntryType } from "@/lib/enums";
import { formatDate, formatCurrency } from "@/lib/format";

const DOT_COLOR: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  gray: "bg-stone-400",
};

type EntryWithAttachments = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  date: Date;
  cost: number | null;
  attachments: {
    id: string;
    storageKey: string;
    fileName: string;
    mimeType: string;
    caption: string | null;
  }[];
};

export function EntryCard({
  entry,
  canEdit,
}: {
  entry: EntryWithAttachments;
  canEdit: boolean;
}) {
  const type = (entry.type in ENTRY_TYPES ? entry.type : "OTHER") as EntryType;
  const color = ENTRY_TYPE_COLORS[type];

  return (
    <li className="relative">
      <span
        className={`absolute -left-[1.95rem] top-5 h-3.5 w-3.5 rounded-full ring-4 ring-[#faf9f7] ${DOT_COLOR[color]}`}
        aria-hidden
      />
      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={color}>{ENTRY_TYPES[type]}</Badge>
            <time className="text-xs text-stone-400">{formatDate(entry.date)}</time>
          </div>
          {canEdit && (
            <form action={deleteEntry}>
              <input type="hidden" name="id" value={entry.id} />
              <ConfirmSubmit
                message="Opravdu smazat tento záznam i s přílohami?"
                className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
              >
                <IconTrash className="h-4 w-4" />
              </ConfirmSubmit>
            </form>
          )}
        </div>

        <h3 className="mt-2 text-base font-semibold text-stone-900">{entry.title}</h3>
        {entry.description && (
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-stone-600">
            {entry.description}
          </p>
        )}

        {entry.cost != null && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <IconMoney className="h-4 w-4 text-stone-400" />
            {formatCurrency(entry.cost)}
          </p>
        )}

        {entry.attachments.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {entry.attachments.map((a) => (
              <AttachmentThumb key={a.id} a={a} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
