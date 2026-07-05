import { redirect } from "next/navigation";

// Kasa se přestěhovala do jednotného Prodeje (merch + jídlo a pití +
// vlastní položky na jednom místě). Staré odkazy vedou tam.
export default function KasaRedirect() {
  redirect("/zazemi/prodej");
}
