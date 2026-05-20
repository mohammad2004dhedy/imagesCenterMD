import { requirePrisma } from "@/lib/prisma";
import { cacheStats } from "@/lib/cache";

export async function trackEvent(data) {
  const db = requirePrisma();
  return db.analytics.create({ data });
}

export async function getAdminDashboard() {
  const db = requirePrisma();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [totalUsers, totalSearches, activeUsers, popularKeywords, apiUsageRows] = await Promise.all([
    db.user.count(),
    db.searchHistory.count(),
    db.user.count({ where: { lastActiveAt: { gte: since } } }),
    db.searchHistory.groupBy({
      by: ["keyword"],
      _count: { keyword: true },
      orderBy: { _count: { keyword: "desc" } },
      take: 8
    }),
    db.analytics.groupBy({
      by: ["provider"],
      _count: { provider: true },
      where: { event: "search" }
    })
  ]);

  return {
    totalUsers,
    totalSearches,
    activeUsers,
    popularKeywords: popularKeywords.map((item) => ({
      keyword: item.keyword,
      count: item._count.keyword
    })),
    apiUsage: Object.fromEntries(apiUsageRows.map((row) => [row.provider || "platform", row._count.provider])),
    searchesByDay: [],
    cache: cacheStats()
  };
}
