import { Router, type IRouter } from "express";
import { eq, desc, sql, and, isNotNull } from "drizzle-orm";
import { db, bathroomsTable, reviewsTable } from "@workspace/db";
import {
  ListBathroomsQueryParams,
  CreateBathroomBody,
  GetBathroomParams,
  GetTopBathroomsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Helper to compute bathroom aggregate stats
async function getBathroomStats(id: number) {
  const [stats] = await db
    .select({
      avgRating: sql<number | null>`avg(${reviewsTable.rating})`,
      avgCleanliness: sql<number | null>`avg(${reviewsTable.cleanliness})`,
      avgSmell: sql<number | null>`avg(${reviewsTable.smell})`,
      hasPaperPercent: sql<number | null>`avg(case when ${reviewsTable.hasPaper} then 100.0 else 0.0 end)`,
      hasSoapPercent: sql<number | null>`avg(case when ${reviewsTable.hasSoap} then 100.0 else 0.0 end)`,
      avgPeeingRating: sql<number | null>`avg(${reviewsTable.peeingRating})`,
      avgPoopingRating: sql<number | null>`avg(${reviewsTable.poopingRating})`,
      avgMakingOutRating: sql<number | null>`avg(${reviewsTable.makingOutRating})`,
      reviewCount: sql<number>`count(*)`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.bathroomId, id));
  return stats;
}

type BathroomStats = NonNullable<Awaited<ReturnType<typeof getBathroomStats>>>;

function fmt(v: number | null | undefined) {
  return v != null ? parseFloat(Number(v).toFixed(2)) : null;
}

function formatBathroom(b: typeof bathroomsTable.$inferSelect, stats: BathroomStats) {
  return {
    id: b.id,
    building: b.building,
    floor: b.floor,
    gender: b.gender,
    description: b.description,
    avgRating: fmt(stats.avgRating),
    avgCleanliness: fmt(stats.avgCleanliness),
    avgSmell: fmt(stats.avgSmell),
    hasPaperPercent: stats.hasPaperPercent != null ? parseFloat(Number(stats.hasPaperPercent).toFixed(1)) : null,
    hasSoapPercent: stats.hasSoapPercent != null ? parseFloat(Number(stats.hasSoapPercent).toFixed(1)) : null,
    avgPeeingRating: fmt(stats.avgPeeingRating),
    avgPoopingRating: fmt(stats.avgPoopingRating),
    avgMakingOutRating: fmt(stats.avgMakingOutRating),
    reviewCount: Number(stats.reviewCount),
    createdAt: b.createdAt,
  };
}

// GET /bathrooms
router.get("/bathrooms", async (req, res): Promise<void> => {
  const parsed = ListBathroomsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const conditions = [];
  if (parsed.data.building) {
    conditions.push(eq(bathroomsTable.building, parsed.data.building));
  }
  if (parsed.data.gender) {
    conditions.push(eq(bathroomsTable.gender, parsed.data.gender as "male" | "female" | "unisex"));
  }

  const bathrooms = await db
    .select()
    .from(bathroomsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(bathroomsTable.createdAt));

  const results = await Promise.all(
    bathrooms.map(async (b) => {
      const stats = await getBathroomStats(b.id);
      return formatBathroom(b, stats);
    })
  );

  res.json(results);
});

// POST /bathrooms
router.post("/bathrooms", async (req, res): Promise<void> => {
  const parsed = CreateBathroomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [bathroom] = await db.insert(bathroomsTable).values(parsed.data).returning();
  const stats = await getBathroomStats(bathroom.id);

  res.status(201).json(formatBathroom(bathroom, stats));
});

// GET /bathrooms/top  (must come before /:id)
router.get("/bathrooms/top", async (req, res): Promise<void> => {
  const parsed = GetTopBathroomsQueryParams.safeParse(req.query);
  const limit = parsed.success && parsed.data.limit ? Number(parsed.data.limit) : 5;
  const by = parsed.success && parsed.data.by ? parsed.data.by : "overall";

  // Choose the sort column based on `by`
  const sortCol = {
    overall: reviewsTable.rating,
    peeing: reviewsTable.peeingRating,
    pooping: reviewsTable.poopingRating,
    "making-out": reviewsTable.makingOutRating,
  }[by] ?? reviewsTable.rating;

  // Only include bathrooms that have at least one non-null value for that column
  const ranked = await db
    .select({
      id: bathroomsTable.id,
    })
    .from(bathroomsTable)
    .innerJoin(reviewsTable, eq(reviewsTable.bathroomId, bathroomsTable.id))
    .where(by !== "overall" ? isNotNull(sortCol) : undefined)
    .groupBy(bathroomsTable.id)
    .orderBy(desc(sql`avg(${sortCol})`))
    .limit(limit);

  const results = await Promise.all(
    ranked.map(async ({ id }) => {
      const [b] = await db.select().from(bathroomsTable).where(eq(bathroomsTable.id, id));
      const stats = await getBathroomStats(id);
      return formatBathroom(b, stats);
    })
  );

  res.json(results);
});

// GET /bathrooms/:id
router.get("/bathrooms/:id", async (req, res): Promise<void> => {
  const params = GetBathroomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [bathroom] = await db
    .select()
    .from(bathroomsTable)
    .where(eq(bathroomsTable.id, params.data.id));

  if (!bathroom) {
    res.status(404).json({ error: "Bathroom not found" });
    return;
  }

  const stats = await getBathroomStats(bathroom.id);
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.bathroomId, bathroom.id))
    .orderBy(desc(reviewsTable.createdAt));

  res.json({
    ...formatBathroom(bathroom, stats),
    reviews,
  });
});

export default router;
