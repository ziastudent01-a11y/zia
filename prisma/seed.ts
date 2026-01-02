import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

const prisma = new PrismaClient();

/**
 * Temporary demo campuses.
 * These can be replaced later without affecting students.
 */
const campuses = [
  {
    code: "LHR",
    name: "Lahore Campus (Demo)",
    latitude: 31.5204,
    longitude: 74.3587,
  },
  {
    code: "KHI",
    name: "Karachi Campus (Demo)",
    latitude: 24.8607,
    longitude: 67.0011,
  },
  {
    code: "ISB",
    name: "Islamabad Campus (Demo)",
    latitude: 33.6844,
    longitude: 73.0479,
  },
];


async function main() {
  console.log("🌱 Seeding campuses...");

  await prisma.campus.upsert({
    where: { code: "MAIN" },
    update: {},
    create: {
      code: "MAIN",
      name: "Main Campus",
      latitude: 31.5204,
      longitude: 74.3587,
    },
  });

  console.log("✅ Campus seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
