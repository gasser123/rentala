import z from "zod";
export const updateApplicationStatusSchema = z.object({
  status: z.enum(["Pending", "Denied", "Approved"]),
});

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
