import z from "zod";
export const createApplicationSchema = z.object({
  applicationDate: z.iso.datetime(),
  status: z.enum(["Pending", "Denied", "Approved"]),
  propertyId: z.int(),
  tenantCognitoId: z.string().min(1, "Tenant cognitoId is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(1, "Message is required"),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
