import MediaLibrary from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1 className="text-[30px] font-light tracking-wide uppercase">Média</h1>
      </div>
      <MediaLibrary />
    </div>
  );
}
