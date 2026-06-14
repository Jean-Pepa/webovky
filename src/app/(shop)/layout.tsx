import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBadge from "@/components/StickyBadge";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-[var(--color-bg)]" style={{ paddingTop: "10mm" }}>{children}</main>
      <Footer />
      <StickyBadge />
    </>
  );
}
