import Link from "next/link";
import { IconArrowLeft } from "@/components/Icons";

export function PropertySectionHeader({
  id,
  name,
  title,
}: {
  id: string;
  name: string;
  title: string;
}) {
  return (
    <div>
      <Link
        href={`/nemovitost/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-teal-700"
      >
        <IconArrowLeft className="h-4 w-4" />
        {name}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
    </div>
  );
}

export function PropertyNotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-stone-500">Nemovitost nenalezena.</p>
      <Link href="/prehled" className="btn-secondary mt-4">
        Zpět na přehled
      </Link>
    </div>
  );
}
