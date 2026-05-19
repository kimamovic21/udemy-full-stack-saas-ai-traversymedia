import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSidebarCollections } from "@/lib/db/collections";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getUserWithSettings } from "@/lib/db/users";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AccountSettings from "@/components/settings/account-settings";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserWithSettings(session.user.id);

  if (!user) {
    redirect("/sign-in");
  }

  // Get sidebar data for layout
  const [itemTypesWithCounts, sidebarCollections] = await Promise.all([
    getItemTypesWithCounts(user.id),
    getSidebarCollections(user.id),
  ]);

  return (
    <DashboardLayout
      itemTypes={itemTypesWithCounts}
      sidebarCollections={sidebarCollections}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Account Settings */}
        <AccountSettings hasPassword={user.hasPassword} />
      </div>
    </DashboardLayout>
  );
}
