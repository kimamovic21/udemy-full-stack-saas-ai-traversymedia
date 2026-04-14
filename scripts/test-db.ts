import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("Connecting to database...");

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Test connection by querying item types
    console.log("\nFetching system item types...");
    const itemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
    });

    console.log(`\nFound ${itemTypes.length} system item types:\n`);
    itemTypes.forEach((type) => {
      console.log(`  ${type.icon} ${type.name} (${type.color})`);
    });

    // Count tables
    console.log("\nTable counts:");
    const [users, items, collections, tags] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.collection.count(),
      prisma.tag.count(),
    ]);

    console.log(`  Users: ${users}`);
    console.log(`  Items: ${items}`);
    console.log(`  Collections: ${collections}`);
    console.log(`  Tags: ${tags}`);

    console.log("\nDatabase connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
