import { prisma } from "@/lib/prisma";

export interface DashboardUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

/**
 * Get user by ID with fields needed for dashboard layout
 */
export async function getUserById(
  userId: string,
): Promise<DashboardUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true },
  });
}
