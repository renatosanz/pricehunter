import ContentLayout from "@/layouts/ContentLayout";

export default function AdminDashboardView() {
  return (
    <ContentLayout title="Panel de Administrador">
      <h1 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        ADMIN
      </h1>
      <div className="bg-muted/50 gap-3 grid grid-cols-1 lg:grid-cols-3 xl:md:grid-cols-4 p-3 rounded-xl md:min-h-min"></div>
    </ContentLayout>
  );
}
