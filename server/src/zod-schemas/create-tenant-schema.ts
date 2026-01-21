import z from "zod";
export const createTenantSchema = z.object({
  cognitoId: z.string().min(1, "Cognito ID is required"),
  email: z.email("Invalid email address"),
  phoneNumber: z.string(),
  name: z.string().min(1, "Name is required"),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
