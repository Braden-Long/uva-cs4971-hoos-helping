import { PrismaClient } from "../app/generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  console.log("Resetting database (deleting all records)...");

  const deletions = [
    { label: "reviews", op: () => prisma.review.deleteMany() },
    { label: "applications", op: () => prisma.application.deleteMany() },
    { label: "tasks", op: () => prisma.task.deleteMany() },
    { label: "sessions", op: () => prisma.session.deleteMany() },
    { label: "accounts", op: () => prisma.account.deleteMany() },
    {
      label: "verification tokens",
      op: () => prisma.verificationToken.deleteMany(),
    },
    { label: "users", op: () => prisma.user.deleteMany() },
  ];

  const results = [];
  for (const deletion of deletions) {
    const result = await deletion.op();
    results.push({ label: deletion.label, count: result.count });
  }

  results.forEach(({ label, count }) => {
    console.log(`Deleted ${count} ${label}.`);
  });

  console.log("Database reset complete.");
}

main()
  .catch((error) => {
    console.error("Failed to reset database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
