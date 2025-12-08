import { Router } from "express";
import { getLeasePayments, getLeases } from "../controllers/lease-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const leaseRoutes = Router();
leaseRoutes.get("/", authMiddleware(["manager", "tenant"]), getLeases);
leaseRoutes.get(
  "/:id/payments",
  authMiddleware(["manager", "tenant"]),
  getLeasePayments
);
