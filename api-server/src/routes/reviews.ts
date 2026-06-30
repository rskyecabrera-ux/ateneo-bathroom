import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, bathroomsTable, reviewsTable } from "@workspace/db";
import {
  CreateReviewParams,
  CreateReviewBody,
  GetBathroomReviewsParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /bathrooms/:id/reviews
router.get("/bathrooms/:id/reviews", async (req, res): Promise<void> => {
  const params = GetBathroomReviewsParams.safeParse(req.params);
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

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.bathroomId, params.data.id))
    .orderBy(desc(reviewsTable.createdAt));

  res.json(reviews);
});

// POST /bathrooms/:id/reviews
router.post("/bathrooms/:id/reviews", async (req, res): Promise<void> => {
  const params = CreateReviewParams.safeParse(req.params);
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

  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, bathroomId: params.data.id })
    .returning();

  res.status(201).json(review);
});

export default router;
