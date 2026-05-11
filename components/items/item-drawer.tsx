"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Pin,
  Copy,
  Pencil,
  Trash2,
  Tag,
  FolderOpen,
  Info,
} from "lucide-react";
import { getItemTypeIcon } from "@/lib/constants/item-types";
import { useItemDrawer } from "./item-drawer-provider";
import { toast } from "sonner";

function DrawerSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
      {/* Action bar skeleton */}
      <Skeleton className="h-9 w-full" />
      <Separator />
      {/* Content skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export default function ItemDrawer() {
  const { isOpen, item, isLoading, closeDrawer } = useItemDrawer();

  const handleCopy = async () => {
    if (!item) return;

    const textToCopy = item.content || item.url || item.title;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const IconComponent = item ? getItemTypeIcon(item.itemType.icon) : null;
  const iconColor = item?.itemType.color;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-xl p-0"
      >
        {isLoading || !item ? (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>Loading item</SheetTitle>
              <SheetDescription>Loading item details</SheetDescription>
            </SheetHeader>
            <DrawerSkeleton />
          </>
        ) : (
          <>
            {/* Header */}
            <SheetHeader className="p-6 pb-0">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: iconColor }}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <SheetTitle className="text-lg truncate">
                    {item.title}
                  </SheetTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="text-xs capitalize"
                      style={{
                        backgroundColor: `${iconColor}20`,
                        color: iconColor,
                      }}
                    >
                      {item.itemType.name}s
                    </Badge>
                    {item.language && (
                      <Badge variant="secondary" className="text-xs">
                        {item.language}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <SheetDescription className="sr-only">
                Details for {item.title}
              </SheetDescription>
            </SheetHeader>

            {/* Action Bar */}
            <div className="flex items-center gap-1 px-6 py-3">
              <button
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                style={
                  item.isFavorite
                    ? { color: "#eab308" }
                    : { color: "var(--color-muted-foreground)" }
                }
              >
                <Star
                  className="h-4 w-4"
                  fill={item.isFavorite ? "#eab308" : "none"}
                />
                Favorite
              </button>
              <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
                <Pin className="h-4 w-4" />
                Pin
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <div className="flex-1" />
              <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <Separator />

            {/* Content Sections */}
            <div className="space-y-6 p-6">
              {/* Description */}
              {item.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm text-foreground">{item.description}</p>
                </div>
              )}

              {/* Content (text types) */}
              {item.content && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Content
                  </p>
                  <div className="rounded-lg border border-border bg-muted/50 overflow-hidden">
                    <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                      <code>
                        {item.content.split("\n").map((line, i) => (
                          <span key={i} className="flex">
                            <span className="inline-block w-8 shrink-0 text-right text-muted-foreground/50 select-none pr-4">
                              {i + 1}
                            </span>
                            <span className="flex-1">{line}</span>
                          </span>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* URL (link types) */}
              {item.url && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    URL
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline break-all"
                  >
                    {item.url}
                  </a>
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Tags
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-muted text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections */}
              {item.collections.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Collections
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.collections.map((collection) => (
                      <Badge
                        key={collection.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {collection.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Details
                  </p>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="text-foreground">
                      {new Date(item.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
