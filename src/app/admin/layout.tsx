import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
}
