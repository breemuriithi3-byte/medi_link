import { describe, expect, it } from "vitest";
import { appointmentSchema, registerSchema, reminderSchema } from "./validation";
describe("input validation", () => {
  it("rejects weak registration passwords", () => expect(registerSchema.safeParse({ name: "A", email: "bad", password: "123" }).success).toBe(false));
  it("accepts a valid appointment", () => expect(appointmentSchema.safeParse({ providerId: "p1", startAt: "2030-01-01T10:00:00.000Z", endAt: "2030-01-01T10:30:00.000Z", reason: "Routine checkup" }).success).toBe(true));
  it("rejects malformed reminder times", () => expect(reminderSchema.safeParse({ medication: "Demo", instructions: "As prescribed", times: ["morning"], startDate: "2030-01-01" }).success).toBe(false));
});
