"use client";

import Link from "next/link";
import type { FavoriteCollection } from "@/lib/db/collections";
import { formatRelativeDate } from "@/lib/utils/date";

interface FavoriteCollectionRowProps {
  collection: FavoriteCollection;
}

export default function FavoriteCollectionRow({
  collection,
}: FavoriteCollectionRowProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="w-full block"
    >
      <div className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors rounded-sm">
        <span className="flex-1 min-w-0 font-mono text-sm text-foreground truncate">
          {collection.name}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground font-mono">
          {collection.itemCount} items
        </span>
        <span className="shrink-0 text-xs text-muted-foreground font-mono">
          {formatRelativeDate(collection.updatedAt)}
        </span>
      </div>
    </Link>
  );
}
