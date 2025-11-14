import { Router } from "express";
import { createTenant, getTenant } from "../controllers/tenant-controller";
export const tenantRoutes = Router();
tenantRoutes.get("/:cognitoId", getTenant);
tenantRoutes.post("/", createTenant);
