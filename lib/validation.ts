import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(160),
  password: z.string().min(8).max(100),
  role: z.enum(["PATIENT", "PROVIDER"]).default("PATIENT")
});
export const appointmentSchema = z.object({
  providerId: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  reason: z.string().trim().min(5).max(500)
});
export const reminderSchema = z.object({
  medication: z.string().trim().min(1).max(120),
  instructions: z.string().trim().min(1).max(300),
  times: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1).max(8),
  startDate: z.string().date(),
  endDate: z.string().date().optional()
});
