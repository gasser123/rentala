import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  createApplication,
  getapplications,
  updateApplicationStatus,
} from "../controllers/application-controller";
import { validateBodyMiddleware } from "../middleware/validate-body-middleware";
import { createApplicationSchema } from "../zod-schemas/create-application-schema";
import { updateApplicationStatusSchema } from "../zod-schemas/update-application-status-schema";

export const applicationRoutes = Router();
applicationRoutes.post(
  "/",
  authMiddleware(["tenant"]),
  validateBodyMiddleware(createApplicationSchema),
  createApplication
);
applicationRoutes.put(
  "/:id/status",
  authMiddleware(["manager"]),
  validateBodyMiddleware(updateApplicationStatusSchema),
  updateApplicationStatus
);

applicationRoutes.get(
  "/",
  authMiddleware(["manager", "tenant"]),
  getapplications
);
