import { Router } from "express";
import {
  createTenant,
  getTenant,
  updateTenant,
} from "../controllers/tenant-controller";
export const tenantRoutes = Router();
tenantRoutes.get("/:cognitoId", getTenant);
tenantRoutes.put("/:cognitoId", updateTenant);
tenantRoutes.post("/", createTenant);
