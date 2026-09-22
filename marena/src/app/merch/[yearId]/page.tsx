import { getSiteOff } from "@/lib/maintenance";
import { isAdminAuthed } from "@/lib/auth";
import { SiteOff } from "@/components/SiteOff";
import ReserveClient from "./reserve-client";

export const dynamic = "force-dynamic";

// Brána rezervační stránky: při vypnutém webu jen „Web je dočasně vypnutý" (kromě správce).
export default async function Page() {
  if ((await getSiteOff()) && !(await isAdminAuthed())) return <SiteOff />;
  return <ReserveClient />;
}
