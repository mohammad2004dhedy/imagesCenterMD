import { requirePrisma } from "@/lib/prisma";

export async function addFavorite(data) {
  const db = requirePrisma();
  const existing = await db.favoriteImage.findUnique({
    where: {
      userId_provider_externalId: {
        userId: data.userId,
        provider: data.provider,
        externalId: data.externalId
      }
    }
  });
  if (existing) return { favorite: existing, alreadyExists: true };

  const favorite = await db.favoriteImage.create({ data });
  return { favorite, alreadyExists: false };
}

export async function getFavorites(userId) {
  const db = requirePrisma();
  return db.favoriteImage.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function deleteFavorite(userId, id) {
  const db = requirePrisma();
  await db.favoriteImage.deleteMany({ where: { userId, id } });
}
