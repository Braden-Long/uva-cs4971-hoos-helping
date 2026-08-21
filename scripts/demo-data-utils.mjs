export const DEMO_EMAIL_DOMAIN = "demo.hooshelping.com";

/**
 * Removes demo data tied to DEMO_EMAIL_DOMAIN.
 *
 * Every delete here is scoped to that domain. Real accounts are never touched:
 * they are deliberately left for manual deletion, since this runs against
 * production.
 *
 * @param {import("../app/generated/prisma/index.js").PrismaClient} prisma
 */
export async function purgeDemoData(prisma) {
  // Not tied to a User row (keyed by email identifier), so this is purged
  // independently of whether any demo users currently exist.
  const verificationTokens = await prisma.verificationToken.deleteMany({
    where: { identifier: { endsWith: DEMO_EMAIL_DOMAIN } },
  });

  const demoUsers = await prisma.user.findMany({
    where: { email: { endsWith: DEMO_EMAIL_DOMAIN } },
    select: { id: true },
  });

  if (!demoUsers.length) {
    return {
      users: 0,
      tasks: 0,
      applications: 0,
      reviews: 0,
      accounts: 0,
      sessions: 0,
      verificationTokens: verificationTokens.count,
    };
  }

  const demoUserIds = demoUsers.map((user) => user.id);

  const reviews = await prisma.review.deleteMany({
    where: {
      OR: [
        { reviewerId: { in: demoUserIds } },
        { revieweeId: { in: demoUserIds } },
        { task: { createdById: { in: demoUserIds } } },
      ],
    },
  });

  const applications = await prisma.application.deleteMany({
    where: {
      OR: [
        { helperId: { in: demoUserIds } },
        { task: { createdById: { in: demoUserIds } } },
      ],
    },
  });

  const tasks = await prisma.task.deleteMany({
    where: {
      OR: [
        { createdById: { in: demoUserIds } },
        { assignedToId: { in: demoUserIds } },
      ],
    },
  });

  const sessions = await prisma.session.deleteMany({
    where: { userId: { in: demoUserIds } },
  });

  const accounts = await prisma.account.deleteMany({
    where: { userId: { in: demoUserIds } },
  });

  const users = await prisma.user.deleteMany({
    where: { id: { in: demoUserIds } },
  });

  return {
    users: users.count,
    tasks: tasks.count,
    applications: applications.count,
    reviews: reviews.count,
    accounts: accounts.count,
    sessions: sessions.count,
    verificationTokens: verificationTokens.count,
  };
}

/**
 * Accounts that purgeDemoData deliberately preserves.
 * @param {import("../app/generated/prisma/index.js").PrismaClient} prisma
 */
export async function findRealUsers(prisma) {
  return prisma.user.findMany({
    where: { NOT: { email: { endsWith: DEMO_EMAIL_DOMAIN } } },
    select: { id: true, email: true, name: true },
    orderBy: { email: "asc" },
  });
}
