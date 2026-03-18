import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  getNotifications,
  updateNotificationReadStatus,
} from "../controllers/notifications-controller";

export const notificationsRoutes = Router();
notificationsRoutes.get(
  "/",
  authMiddleware(["manager", "tenant"]),
  getNotifications,
);

notificationsRoutes.patch(
  "/:id/read",
  authMiddleware(["manager", "tenant"]),
  updateNotificationReadStatus,
);
