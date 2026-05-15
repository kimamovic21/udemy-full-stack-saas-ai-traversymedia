import { redirect } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { auth } from "@/auth";
import { getSidebarCollections, getAllCollections } from "@/lib/db/collections";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getUserById } from "@/lib/db/users";
import DashboardLayout from "@/components/layout/dashboard-layout";
import CollectionCard from "@/components/dashboard/collection-card";

export default async function CollectionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/sign-in");
  }

  const [collections, itemTypes, sidebarCollections] = await Promise.all([
    getAllCollections(user.id),
    getItemTypesWithCounts(user.id),
    getSidebarCollections(user.id),
  ]);

  return (
    <DashboardLayout
      itemTypes={itemTypes}
      sidebarCollections={sidebarCollections}
      user={user}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FolderOpen className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">
            Collections
          </h1>
          <span className="text-muted-foreground">({collections.length})</span>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No collections yet. Create your first one!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
