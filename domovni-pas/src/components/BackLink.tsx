import Link from "next/link";
import { IconArrowLeft } from "./Icons";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-stone-800"
    >
      <IconArrowLeft className="h-4 w-4" />
      {children}
    </Link>
  );
}
