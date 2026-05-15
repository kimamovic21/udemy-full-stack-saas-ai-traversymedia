import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCollectionById } from "./collections";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    collection: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const mockFindFirst = vi.mocked(prisma.collection.findFirst);

const mockDate = new Date("2025-06-15T12:00:00Z");

const basePrismaCollection = {
  id: "col-1",
  name: "React Patterns",
  description: "Useful React patterns and hooks",
  isFavorite: true,
  userId: "user-1",
  defaultTypeId: null,
  createdAt: mockDate,
  updatedAt: mockDate,
  _count: { items: 3 },
  items: [
    {
      item: {
        itemType: {
          id: "type-1",
          name: "snippet",
          icon: "Code",
          color: "#3b82f6",
        },
      },
    },
    {
      item: {
        itemType: {
          id: "type-1",
          name: "snippet",
          icon: "Code",
          color: "#3b82f6",
        },
      },
    },
    {
      item: {
        itemType: {
          id: "type-2",
          name: "note",
          icon: "StickyNote",
          color: "#fde047",
        },
      },
    },
  ],
};

describe("getCollectionById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mapped collection detail when collection exists and belongs to user", async () => {
    mockFindFirst.mockResolvedValue(basePrismaCollection as never);

    const result = await getCollectionById("col-1", "user-1");

    expect(result).toEqual({
      id: "col-1",
      name: "React Patterns",
      description: "Useful React patterns and hooks",
      isFavorite: true,
      itemCount: 3,
      itemTypes: [
        { name: "snippet", icon: "Code", color: "#3b82f6", count: 2 },
        { name: "note", icon: "StickyNote", color: "#fde047", count: 1 },
      ],
      dominantColor: "#3b82f6",
      createdAt: mockDate,
      updatedAt: mockDate,
    });
  });

  it("returns null when collection does not exist", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await getCollectionById("nonexistent", "user-1");

    expect(result).toBeNull();
  });

  it("returns null dominantColor when collection has no items", async () => {
    mockFindFirst.mockResolvedValue({
      ...basePrismaCollection,
      _count: { items: 0 },
      items: [],
    } as never);

    const result = await getCollectionById("col-1", "user-1");

    expect(result?.itemTypes).toEqual([]);
    expect(result?.dominantColor).toBeNull();
  });

  it("sorts item types by count descending", async () => {
    mockFindFirst.mockResolvedValue({
      ...basePrismaCollection,
      items: [
        {
          item: {
            itemType: {
              id: "type-1",
              name: "note",
              icon: "StickyNote",
              color: "#fde047",
            },
          },
        },
        {
          item: {
            itemType: {
              id: "type-2",
              name: "snippet",
              icon: "Code",
              color: "#3b82f6",
            },
          },
        },
        {
          item: {
            itemType: {
              id: "type-2",
              name: "snippet",
              icon: "Code",
              color: "#3b82f6",
            },
          },
        },
        {
          item: {
            itemType: {
              id: "type-2",
              name: "snippet",
              icon: "Code",
              color: "#3b82f6",
            },
          },
        },
      ],
    } as never);

    const result = await getCollectionById("col-1", "user-1");

    expect(result?.itemTypes[0].name).toBe("snippet");
    expect(result?.itemTypes[0].count).toBe(3);
    expect(result?.itemTypes[1].name).toBe("note");
    expect(result?.itemTypes[1].count).toBe(1);
  });

  it("calls prisma with correct where clause including userId", async () => {
    mockFindFirst.mockResolvedValue(basePrismaCollection as never);

    await getCollectionById("col-1", "user-1");

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "col-1", userId: "user-1" },
      }),
    );
  });
});
