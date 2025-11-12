export const DEMO_EMAIL_DOMAIN = "demo.hooshelping.com";

/**
 * Removes demo data tied to DEMO_EMAIL_DOMAIN.
 * @param {import("../app/generated/prisma/index.js").PrismaClient} prisma
 */
export async function purgeDemoData(prisma) {
  const demoUsers = await prisma.user.findMany({
    where: { email: { endsWith: DEMO_EMAIL_DOMAIN } },
    select: { id: true },
  });

  if (!demoUsers.length) {
    return { users: 0, tasks: 0, applications: 0, reviews: 0, accounts: 0, sessions: 0 };
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
  };
}
