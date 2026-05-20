import { requirePrisma } from "@/lib/prisma";

export async function addSearchHistory(data) {
  const db = requirePrisma();
  return db.searchHistory.create({ data });
}

export async function getSearchHistory(userId) {
  const db = requirePrisma();
  return db.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

export async function deleteSearchHistory(userId, id) {
  const db = requirePrisma();
  await db.searchHistory.deleteMany({ where: { id, userId } });
}

export async function clearSearchHistory(userId) {
  const db = requirePrisma();
  await db.searchHistory.deleteMany({ where: { userId } });
}
