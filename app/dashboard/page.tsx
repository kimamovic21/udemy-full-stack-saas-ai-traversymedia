import TopBar from "@/components/layout/top-bar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border p-6">
          <h2 className="text-xl font-semibold">Sidebar</h2>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <h2 className="text-xl font-semibold">Main</h2>
        </main>
      </div>
    </div>
  );
}
