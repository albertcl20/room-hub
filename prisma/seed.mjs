import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: "demo-hq" },
    update: {},
    create: {
      name: "Demo HQ",
      slug: "demo-hq",
    },
  });

  console.log(`Seed base ready for ${organization.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
