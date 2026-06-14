import { TruckIcon, ShieldIcon, StarIcon, BeamIcon } from "./Icons";

const ITEMS = [
  { icon: TruckIcon, title: "Doprava do 15 km zdarma", text: "závoz na stavbu i provoz" },
  { icon: BeamIcon, title: "Dělení materiálu na míru", text: "řezání, stříhání, ohýbání" },
  { icon: ShieldIcon, title: "30+ let zkušeností", text: "spolehlivý partner od 1991" },
  { icon: StarIcon, title: "Tisíce spokojených zákazníků", text: "firmy, živnostníci i kutilé" },
];

export default function TrustBar() {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--color-border)]">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="flex items-center gap-3 px-3 py-3">
              <span className="shrink-0 w-9 h-9 rounded-lg grid place-items-center text-[var(--color-accent)] bg-[var(--color-bg)]">
                <Icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight truncate">{it.title}</div>
                <div className="text-xs text-[var(--color-ink-soft)] truncate">{it.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
