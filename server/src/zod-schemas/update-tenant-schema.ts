import z from "zod";
export const updateTenantSchema = z.object({
  email: z.email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  name: z.string().min(1, "Name is required"),
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
