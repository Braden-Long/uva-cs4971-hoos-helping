import { PrismaClient } from "../app/generated/prisma/index.js";
import {
  purgeDemoData,
  findRealUsers,
  DEMO_EMAIL_DOMAIN,
} from "./demo-data-utils.mjs";

const prisma = new PrismaClient();

/**
 * Removes seeded demo data only.
 *
 * This deliberately does NOT delete real accounts. It previously called
 * prisma.<model>.deleteMany() with no filter on every table, which wiped the
 * entire database -- including real users -- and this is routinely pointed at
 * production. Deleting a real account is a decision that deserves a human, so
 * it is left as a manual step.
 */
async function main() {
  console.log(`Removing demo data (*@${DEMO_EMAIL_DOMAIN})...`);

  const removed = await purgeDemoData(prisma);

  const labels = {
    users: "users",
    tasks: "tasks",
    applications: "applications",
    reviews: "reviews",
    accounts: "accounts",
    sessions: "sessions",
    verificationTokens: "verification tokens",
  };
  for (const [key, label] of Object.entries(labels)) {
    console.log(`  Deleted ${removed[key] ?? 0} ${label}.`);
  }

  const realUsers = await findRealUsers(prisma);
  if (realUsers.length) {
    console.log(
      `\nPreserved ${realUsers.length} real account(s) — delete these by hand if you truly want them gone:`
    );
    for (const user of realUsers) {
      console.log(`  ${user.email}${user.name ? ` (${user.name})` : ""}`);
    }
  }

  console.log("\nDemo data reset complete.");
}

main()
  .catch((error) => {
    console.error("Failed to reset demo data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
