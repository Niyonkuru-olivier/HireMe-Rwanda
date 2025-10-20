// scripts/create-admin.cjs
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await hash("yourpassword", 10);

  const admin = await prisma.admin.create({
    data: { email: "admin@example.com", password },
  });

  console.log("Admin created:", admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
