import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const genderEnum = pgEnum("gender", ["male", "female", "unisex"]);

export const bathroomsTable = pgTable("bathrooms", {
  id: serial("id").primaryKey(),
  building: text("building").notNull(),
  floor: text("floor").notNull(),
  gender: genderEnum("gender").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bathroomId: integer("bathroom_id")
    .notNull()
    .references(() => bathroomsTable.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  cleanliness: integer("cleanliness").notNull(),
  smell: integer("smell").notNull(),
  hasPaper: boolean("has_paper").notNull(),
  hasSoap: boolean("has_soap").notNull(),
  peeingRating: integer("peeing_rating"),
  poopingRating: integer("pooping_rating"),
  makingOutRating: integer("making_out_rating"),
  comment: text("comment"),
  reviewerName: text("reviewer_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBathroomSchema = createInsertSchema(bathroomsTable).omit({ id: true, createdAt: true });
export type InsertBathroom = z.infer<typeof insertBathroomSchema>;
export type Bathroom = typeof bathroomsTable.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
