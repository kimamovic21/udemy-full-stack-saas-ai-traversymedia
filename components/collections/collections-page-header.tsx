"use client";

import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewItemDialog from "@/components/items/new-item-dialog";

interface CollectionsPageHeaderProps {
  collectionCount: number;
  isPro?: boolean;
}

export default function CollectionsPageHeader({
  collectionCount,
  isPro,
}: CollectionsPageHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">
            Collections
          </h1>
          <span className="text-muted-foreground">({collectionCount})</span>
        </div>

        <Button onClick={() => setDialogOpen(true)} className="sm:self-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Item
        </Button>
      </div>

      <NewItemDialog open={dialogOpen} onOpenChange={setDialogOpen} isPro={isPro} />
    </>
  );
}