import { z } from "zod";

export const createBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "title is required")
    .min(5, "title must be at least 5 chars"),

  author: z
    .string()
    .trim()
    .min(1, "author is required")
    .min(2, "author must be at least 2 chars"),

  bookUrl: z
    .string()
    .trim()
    .url("bookUrl must be a valid URL")
    .optional()
    .or(z.literal("")),

  category: z.string().trim().min(1, "category is required"),

  skillLevel: z.string().trim().optional().default("beginner"),

  tags: z.array(z.string().trim().min(1)).optional().default([]),

  publishedBy: z.string().trim().optional(),
});

export const updateBookSchema = createBookSchema.partial(); //for future use.
