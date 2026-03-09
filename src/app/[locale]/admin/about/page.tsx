import { createAdminClient } from "@/lib/supabase/admin";
import AboutForm from "@/components/admin/AboutForm";

export default async function AdminAboutPage() {
  const supabase = createAdminClient();
  const { data: about } = await supabase
    .from("about_content")
    .select("*")
    .limit(1)
    .single();

  if (!about) {
    return <div className="p-8">Nebyla nalezena data &quot;O mně&quot;.</div>;
  }

  return <AboutForm about={about} />;
}
