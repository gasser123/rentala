import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  createCheckoutSession,
  getSessionStatus,
} from "../controllers/payment-controller";

export const paymentRoutes = Router();

paymentRoutes.post(
  "/create-checkout-session",
  authMiddleware(["tenant"]),
  createCheckoutSession,
);

paymentRoutes.get(
  "/session-status",
  authMiddleware(["tenant"]),
  getSessionStatus,
);
