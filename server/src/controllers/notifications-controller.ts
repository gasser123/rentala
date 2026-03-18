import { Request, Response } from "express";
import { prisma } from "../prisma";
import { NotificationService } from "../services/notification-service";
const notificationService = new NotificationService(prisma);
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user!;
    const notifications = await notificationService.getNotificationsForUser(
      id,
      role,
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNotificationReadStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id, role } = req.user!;
    const notification = await notificationService.findNotification(
      parseInt(req.params.id),
      id,
      role,
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await notificationService.updateNotificationReadStatus(
      parseInt(req.params.id),
    );
    res
      .status(200)
      .json({ message: "Notification read status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
