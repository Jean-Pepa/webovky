import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import AccountDetailsForm from "@/components/account/AccountDetailsForm";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AccountDetailsPage() {
  const lang = await getLang();
  return (
    <AccountShell active="udaje">
      <h1 className="text-2xl font-extrabold">{t(lang, "acc.details")}</h1>
      <AccountDetailsForm />
    </AccountShell>
  );
}
