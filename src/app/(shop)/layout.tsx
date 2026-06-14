import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBar from "@/components/TrustBar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <TrustBar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
