import { Router } from "express";
import {
  addFavoriteProperty,
  createTenant,
  getCurrentResidences,
  getTenant,
  removeFavoriteProperty,
  updateTenant,
} from "../controllers/tenant-controller";
import { validateBodyMiddleware } from "../middleware/validate-body-middleware";
import { createTenantSchema } from "../zod-schemas/create-tenant-schema";
import { updateTenantSchema } from "../zod-schemas/update-tenant-schema";
export const tenantRoutes = Router();
tenantRoutes.get("/:cognitoId", getTenant);
tenantRoutes.put(
  "/:cognitoId",
  validateBodyMiddleware(updateTenantSchema),
  updateTenant
);
tenantRoutes.post(
  "/",
  validateBodyMiddleware(createTenantSchema),
  createTenant
);
tenantRoutes.get("/:cognitoId/current-residences", getCurrentResidences);
tenantRoutes.post("/:cognitoId/favorites/:propertyId", addFavoriteProperty);
tenantRoutes.delete(
  "/:cognitoId/favorites/:propertyId",
  removeFavoriteProperty
);
