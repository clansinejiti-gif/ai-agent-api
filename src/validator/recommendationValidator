import { z } from 'zod';

export const studentRecommendationSchema = z.object({
  focusArea: z.string()
    .trim()
    .min(1, "focusArea is required")
    .min(3, "focusArea too short"),

  timeCommitmentHoursPerWeek: z.number({
      required_error: "timeCommitment is required",
      invalid_type_error: "timeCommitment must be a number"
    })
    .min(1, "Minimum 1 hour per week")
    .max(80, "Maximum 80 hours per week")
    .int("Must be whole number like 5, not 5.5"),

  primaryGoal: z.string()
    .trim()
    .min(1, "primaryGoal is required")
    .min(5, "Goal should be at least 5 characters")
});