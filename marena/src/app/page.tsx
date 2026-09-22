import { getSiteOff } from "@/lib/maintenance";
import { isAdminAuthed } from "@/lib/auth";
import { SiteOff } from "@/components/SiteOff";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

// Brána veřejného webu: když správce web vypnul, ostatní vidí jen „Web je dočasně
// vypnutý" (správce se správcovskou cookie projde). Jinak běžná hlavní stránka.
export default async function Page() {
  if ((await getSiteOff()) && !(await isAdminAuthed())) return <SiteOff />;
  return <HomeClient />;
}
