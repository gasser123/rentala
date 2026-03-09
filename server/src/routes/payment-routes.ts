import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  createCheckoutSession,
  getSessionStatus,
} from "../controllers/payment-controller";
import express from "express";
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
