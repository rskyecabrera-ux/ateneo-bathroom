import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, bathroomsTable, reviewsTable } from "@workspace/db";

const router: IRouter = Router();

// GET /stats
router.get("/stats", async (_req, res): Promise<void> => {
  const [totals] = await db
    .select({
      totalBathrooms: sql<number>`(select count(*) from ${bathroomsTable})`,
      totalReviews: sql<number>`(select count(*) from ${reviewsTable})`,
      avgRatingOverall: sql<number | null>`(select avg(${reviewsTable.rating}) from ${reviewsTable})`,
      avgPeeingRating: sql<number | null>`(select avg(${reviewsTable.peeingRating}) from ${reviewsTable} where ${reviewsTable.peeingRating} is not null)`,
      avgPoopingRating: sql<number | null>`(select avg(${reviewsTable.poopingRating}) from ${reviewsTable} where ${reviewsTable.poopingRating} is not null)`,
      avgMakingOutRating: sql<number | null>`(select avg(${reviewsTable.makingOutRating}) from ${reviewsTable} where ${reviewsTable.makingOutRating} is not null)`,
    })
    .from(bathroomsTable)
    .limit(1);

  // Building breakdown
  const buildingBreakdown = await db
    .select({
      building: bathroomsTable.building,
      bathroomCount: sql<number>`count(distinct ${bathroomsTable.id})`,
      avgRating: sql<number | null>`avg(${reviewsTable.rating})`,
    })
    .from(bathroomsTable)
    .leftJoin(reviewsTable, eq(reviewsTable.bathroomId, bathroomsTable.id))
    .groupBy(bathroomsTable.building)
    .orderBy(desc(sql`count(distinct ${bathroomsTable.id})`));

  // Recent reviews with bathroom info
  const recentReviews = await db
    .select({
      id: reviewsTable.id,
      bathroomId: reviewsTable.bathroomId,
      building: bathroomsTable.building,
      floor: bathroomsTable.floor,
      gender: bathroomsTable.gender,
      rating: reviewsTable.rating,
      comment: reviewsTable.comment,
      reviewerName: reviewsTable.reviewerName,
      createdAt: reviewsTable.createdAt,
    })
    .from(reviewsTable)
    .innerJoin(bathroomsTable, eq(bathroomsTable.id, reviewsTable.bathroomId))
    .orderBy(desc(reviewsTable.createdAt))
    .limit(10);

  function fmt(v: number | null | undefined) {
    return v != null ? parseFloat(Number(v).toFixed(2)) : null;
  }

  res.json({
    totalBathrooms: Number(totals?.totalBathrooms ?? 0),
    totalReviews: Number(totals?.totalReviews ?? 0),
    avgRatingOverall: fmt(totals?.avgRatingOverall),
    avgPeeingRating: fmt(totals?.avgPeeingRating),
    avgPoopingRating: fmt(totals?.avgPoopingRating),
    avgMakingOutRating: fmt(totals?.avgMakingOutRating),
    buildingBreakdown: buildingBreakdown.map((b) => ({
      building: b.building,
      bathroomCount: Number(b.bathroomCount),
      avgRating: b.avgRating ? parseFloat(Number(b.avgRating).toFixed(2)) : null,
    })),
    recentReviews,
  });
});

export default router;
