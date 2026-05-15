import Link from "next/link";
import CollectionCard from "./collection-card";
import type { CollectionWithTypes } from "@/lib/db/collections";

interface CollectionsSectionProps {
  collections: CollectionWithTypes[];
}

export default function CollectionsSection({
  collections,
}: CollectionsSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Collections</h2>
        <Link
          href="/collections"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </div>
      {collections.length === 0 ? (
        <p className="text-muted-foreground text-sm">No collections yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <CollectionCard collection={collection} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
