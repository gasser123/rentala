import { Router } from "express";
import {
  createManager,
  getManager,
  getManagerProperties,
  updateManager,
} from "../controllers/manager-controller";
import { validateBodyMiddleware } from "../middleware/validate-body-middleware";
import { createManagerSchema } from "../zod-schemas/create-manager-schema";
import { updateManagerSchema } from "../zod-schemas/update-manager-schema";
export const managerRoutes = Router();
managerRoutes.get("/:cognitoId", getManager);
managerRoutes.put(
  "/:cognitoId",
  validateBodyMiddleware(updateManagerSchema),
  updateManager
);
managerRoutes.post(
  "/",
  validateBodyMiddleware(createManagerSchema),
  createManager
);
managerRoutes.get("/:cognitoId/properties", getManagerProperties);
