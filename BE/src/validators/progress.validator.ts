import { z } from "zod";

const sessionIdSchema = z
  .string({ error: "sessionId is required" })
  .min(8, "sessionId must be at least 8 characters")
  .max(128, "sessionId must be at most 128 characters")
  .regex(
    /^[a-zA-Z0-9_\-]+$/,
    "sessionId may only contain letters, numbers, underscores, and hyphens",
  );

const stepIndexSchema = z
  .number({ error: "currentStepIndex is required" })
  .int("currentStepIndex must be an integer")
  .min(0, "currentStepIndex must be >= 0")
  .max(10, "currentStepIndex must be <= 10");

const totalStepsSchema = z
  .number({ error: "totalSteps is required" })
  .int("totalSteps must be an integer")
  .min(1, "totalSteps must be >= 1")
  .max(10, "totalSteps must be <= 10");

const answersSchema = z
  .object({
    ageRange: z.enum(["18-24", "25-34", "35-44", "45-54", "55+"]).optional(),

    goal: z
      .enum(["fitness", "nutrition", "mindfulness", "productivity", "learning"])
      .optional(),

    activityLevel: z
      .enum(["sedentary", "light", "moderate", "active", "very_active"])
      .optional(),

    dietPreference: z
      .enum(["omnivore", "vegetarian", "vegan", "keto", "paleo"])
      .optional(),

    interests: z
      .array(z.string().min(1).max(50))
      .max(20, "Maximum 20 interests allowed")
      .optional(),

    notificationFrequency: z.enum(["daily", "weekly", "never"]).optional(),

    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(40, "Name must be at most 40 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters")
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.activityLevel && data.goal && data.goal !== "fitness") {
      ctx.addIssue({
        code: "custom",
        path: ["activityLevel"],
        message: 'activityLevel is only valid when goal is "fitness"',
      });
    }
  });

export const saveProgressSchema = z
  .object({
    sessionId: sessionIdSchema,
    currentStepIndex: stepIndexSchema,
    totalSteps: totalStepsSchema,
    answers: answersSchema,
    completed: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.currentStepIndex >= data.totalSteps) {
      ctx.addIssue({
        code: "custom",
        path: ["currentStepIndex"],
        message: `currentStepIndex (${data.currentStepIndex}) must be less than totalSteps (${data.totalSteps})`,
      });
    }
  });

export const getProgressSchema = z.object({
  sessionId: sessionIdSchema,
});

export const deleteProgressSchema = z.object({
  sessionId: sessionIdSchema,
});

export type SaveProgressInput = z.infer<typeof saveProgressSchema>;
export type GetProgressInput = z.infer<typeof getProgressSchema>;
