import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setShareEnabled, regenerateShareToken } from "@/lib/actions/share";
import { BackLink } from "@/components/BackLink";
import { CopyButton } from "@/components/ui/CopyButton";
import { IconShare, IconLink } from "@/components/Icons";

export const metadata = { title: "Sdílení — Domovní pas" };

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();
  if (property.ownerId !== user.id) redirect(`/nemovitost/${id}`);

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const shareUrl = property.shareToken ? `${proto}://${host}/sdileno/${property.shareToken}` : "";
  const active = property.shareEnabled && !!property.shareToken;

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Sdílení</h1>
      <p className="mt-1 text-sm text-stone-500">
        Vytvořte read-only odkaz pro kupujícího, makléře nebo řemeslníka. Uvidí historii i
        dokumenty, ale nemohou nic měnit. Odkaz kdykoli vypnete.
      </p>

      <div className="card mt-6 p-6">
        {active ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Sdílení je zapnuté
            </div>

            <div>
              <label className="label">Veřejný odkaz</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input readOnly value={shareUrl} className="input flex-1 bg-stone-50" />
                <CopyButton text={shareUrl} />
              </div>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-teal-700 hover:underline"
              >
                <IconLink className="h-4 w-4" />
                Otevřít náhled
              </a>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-stone-100 pt-4">
              <form action={setShareEnabled}>
                <input type="hidden" name="propertyId" value={id} />
                <input type="hidden" name="enable" value="0" />
                <button className="btn-danger btn-sm">Vypnout sdílení</button>
              </form>
              <form action={regenerateShareToken}>
                <input type="hidden" name="propertyId" value={id} />
                <button className="btn-secondary btn-sm">Vygenerovat nový odkaz</button>
              </form>
            </div>
            <p className="text-xs text-stone-400">
              Vygenerováním nového odkazu přestane ten původní fungovat.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
              <IconShare className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-stone-800">Sdílení je vypnuté</p>
            <p className="mt-1 max-w-sm text-sm text-stone-500">
              Zapnutím vytvoříte veřejný odkaz, přes který si kdokoli prohlédne historii této
              nemovitosti — bez možnosti úprav.
            </p>
            <form action={setShareEnabled} className="mt-5">
              <input type="hidden" name="propertyId" value={id} />
              <input type="hidden" name="enable" value="1" />
              <button className="btn-primary">
                <IconShare className="h-4 w-4" />
                Zapnout sdílení
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
