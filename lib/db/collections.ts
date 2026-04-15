import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";

/**
 * Get the demo user (temporary until auth is implemented)
 */
export async function getDemoUser() {
  return prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
  });
}

export interface CollectionItemType {
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface CollectionWithTypes {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  itemTypes: CollectionItemType[];
  dominantColor: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get recent collections for a user with item type information
 * Returns collections sorted by updatedAt, with aggregated item type data
 */
export async function getRecentCollections(
  userId: string,
  limit: number = 6,
): Promise<CollectionWithTypes[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
      },
    },
  });

  return collections.map((collection) => {
    // Count items by type
    const typeCounts = new Map<string, CollectionItemType>();

    for (const itemCollection of collection.items) {
      const itemType = itemCollection.item.itemType;
      const existing = typeCounts.get(itemType.id);

      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(itemType.id, {
          name: itemType.name,
          icon: itemType.icon,
          color: itemType.color,
          count: 1,
        });
      }
    }

    // Convert to array and sort by count (descending)
    const itemTypes = Array.from(typeCounts.values()).sort(
      (a, b) => b.count - a.count,
    );

    // Get dominant color from most-used type
    const dominantColor = itemTypes.length > 0 ? itemTypes[0].color : null;

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      itemTypes,
      dominantColor,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    };
  });
}

export interface SidebarCollection {
  id: string;
  name: string;
  itemCount: number;
  isFavorite: boolean;
  dominantColor: string | null;
}

export interface SidebarCollections {
  favorites: SidebarCollection[];
  recents: SidebarCollection[];
}

/**
 * Get collections for sidebar (favorites and recents)
 */
export async function getSidebarCollections(
  userId: string,
): Promise<SidebarCollections> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
      },
    },
  });

  const processCollection = (
    collection: (typeof collections)[0],
  ): SidebarCollection => {
    // Count items by type to find dominant color
    const typeCounts = new Map<string, { color: string; count: number }>();

    for (const itemCollection of collection.items) {
      const itemType = itemCollection.item.itemType;
      const existing = typeCounts.get(itemType.id);

      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(itemType.id, {
          color: itemType.color,
          count: 1,
        });
      }
    }

    // Get dominant color from most-used type
    let dominantColor: string | null = null;
    let maxCount = 0;
    for (const { color, count } of typeCounts.values()) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    }

    return {
      id: collection.id,
      name: collection.name,
      itemCount: collection.items.length,
      isFavorite: collection.isFavorite,
      dominantColor,
    };
  };

  const favorites = collections
    .filter((c) => c.isFavorite)
    .slice(0, 5)
    .map(processCollection);

  const recents = collections
    .filter((c) => !c.isFavorite)
    .slice(0, 3)
    .map(processCollection);

  return { favorites, recents };
}
