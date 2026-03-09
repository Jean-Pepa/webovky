import { createAdminClient } from "@/lib/supabase/admin";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (!settings) {
    return <div className="p-8">Nebyla nalezena nastavení webu.</div>;
  }

  return <SettingsForm settings={settings} />;
}
