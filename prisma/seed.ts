import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        email: "aunt@optometry.com",
        passwordHash: hashPassword("optometry2026"),
        name: "Thembisile", // Updated Name
        role: "OPTOMETRIST",
      },
      {
        email: "reception@optometry.com",
        passwordHash: hashPassword("reception2026"),
        name: "Receptionist",
        role: "RECEPTIONIST",
      },
    ],
  });
  console.log("✅ Users seeded successfully for Thembisile");
}

main().finally(() => prisma.$disconnect());
