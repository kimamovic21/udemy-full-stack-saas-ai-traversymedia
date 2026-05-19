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

export interface UserWithSettings extends DashboardUser {
  hasPassword: boolean;
  createdAt: Date;
}

/**
 * Get user by ID with fields needed for profile/settings pages
 */
export async function getUserWithSettings(
  userId: string,
): Promise<UserWithSettings | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    hasPassword: !!user.password,
    createdAt: user.createdAt,
  };
}
