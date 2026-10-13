import { z } from "zod";

export const createCareerTrackSchema = z.object({
  trackId: z
    .string()
    .trim()
    .min(1, "trackId is required")
    .min(2, "trackId must be at least 2 chars"),

  title: z
    .string()
    .trim()
    .min(1, "title is required")
    .min(3, "title must be at least 3 chars"),

  domain: z.string().trim().min(1, "domain is required"),

  keySkills: z.array(z.string().trim().min(1)).optional().default([]),

  industryDemand: z
    .enum(["high", "low", "medium"], {
      errorMap: () => ({
        message: "industryDemand must be high, low, or medium",
      }),
    })
    .default("medium"),
});
