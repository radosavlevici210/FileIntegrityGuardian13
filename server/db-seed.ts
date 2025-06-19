
import { drizzle } from "drizzle-orm/node-postgres";
import { users, projects } from "../shared/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.log("No DATABASE_URL found, skipping database seed");
  process.exit(0);
}

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    // Add any seed data here when needed
    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
