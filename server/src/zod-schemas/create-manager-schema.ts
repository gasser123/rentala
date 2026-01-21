import z from "zod";
export const createManagerSchema = z.object({
  cognitoId: z.string().min(1, "Cognito ID is required"),
  email: z.email("Invalid email address"),
  phoneNumber: z.string(),
  name: z.string().min(1, "Name is required"),
});

export type CreateManagerInput = z.infer<typeof createManagerSchema>;
