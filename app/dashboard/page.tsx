import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCards from "@/components/dashboard/stats-cards";
import CollectionsSection from "@/components/dashboard/collections-section";
import PinnedItems from "@/components/dashboard/pinned-items";
import RecentItems from "@/components/dashboard/recent-items";
import {
  getDemoUser,
  getRecentCollections,
  getSidebarCollections,
} from "@/lib/db/collections";
import {
  getPinnedItems,
  getRecentItems,
  getDashboardStats,
  getItemTypesWithCounts,
} from "@/lib/db/items";

export default async function DashboardPage() {
  const user = await getDemoUser();

  const [
    collections,
    pinnedItems,
    recentItems,
    stats,
    itemTypes,
    sidebarCollections,
  ] = user
    ? await Promise.all([
        getRecentCollections(user.id, 6),
        getPinnedItems(user.id),
        getRecentItems(user.id, 10),
        getDashboardStats(user.id),
        getItemTypesWithCounts(user.id),
        getSidebarCollections(user.id),
      ])
    : [
        [],
        [],
        [],
        {
          totalItems: 0,
          totalCollections: 0,
          favoriteItems: 0,
          favoriteCollections: 0,
        },
        [],
        { favorites: [], recents: [] },
      ];

  return (
    <DashboardLayout
      itemTypes={itemTypes}
      sidebarCollections={sidebarCollections}
      user={user}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Your developer knowledge hub</p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Collections */}
        <CollectionsSection collections={collections} />

        {/* Pinned Items */}
        <PinnedItems items={pinnedItems} />

        {/* Recent Items */}
        <RecentItems items={recentItems} />
      </div>
    </DashboardLayout>
  );
}
