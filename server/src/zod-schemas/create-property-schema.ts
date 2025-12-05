import z from "zod";

export const createPropertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  managerCognitoId: z.string().min(1, "Manager Cognito ID is required"),
  amenities: z.string().optional(),
  highlights: z.string().optional(),
  isPetsAllowed: z.enum(["true", "false"]),
  isParkingIncluded: z.enum(["true", "false"]),
  pricePerMonth: z.string().refine((val) => !isNaN(parseFloat(val)), {
    error: "Price must be a valid number",
  }),
  securityDeposit: z.string().refine((val) => !isNaN(parseFloat(val)), {
    error: "Security deposit must be a valid number",
  }),
  applicationFee: z.string().refine((val) => !isNaN(parseFloat(val)), {
    error: "Application fee must be a valid number",
  }),
  beds: z.string().refine((val) => !isNaN(parseInt(val)), {
    error: "Number of beds must be a valid number",
  }),
  baths: z.string().refine((val) => !isNaN(parseFloat(val)), {
    error: "Number of baths must be a valid number",
  }),
  squareFeet: z.string().refine((val) => !isNaN(parseInt(val)), {
    error: "Square feet must be a valid number",
  }),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
