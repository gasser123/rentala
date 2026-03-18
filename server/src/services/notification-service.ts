import { Notification, PrismaClient } from "@prisma/client";

export class NotificationService {
  constructor(private prisma: PrismaClient) {}

  getNotificationsForUser = async (userCognitoId: string, userRole: string) => {
    const whereClause =
      userRole === "manager"
        ? { managerCognitoId: userCognitoId }
        : { tenantCognitoId: userCognitoId };
    try {
      return await this.prisma.notification.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  };

  updateNotificationReadStatus = async (id: number) => {
    try {
      await this.prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    } catch (error) {
      console.error("Error updating notification read status:", error);
      throw error;
    }
  };

  findNotification = async (
    notificationId: number,
    userCognitoId: string,
    userRole: string,
  ) => {
    try {
      const whereClause = {
        id: notificationId,
        ...(userRole === "manager"
          ? { managerCognitoId: userCognitoId }
          : { tenantCognitoId: userCognitoId }),
      };
      return await this.prisma.notification.findFirst({
        where: whereClause,
      });
    } catch (error) {
      console.error("Error finding notification:", error);
      throw error;
    }
  };

  createNotification = async (
    info: Omit<Notification, "id" | "createdAt" | "read">,
  ) => {
    try {
      return await this.prisma.notification.create({
        data: {
          ...info,
        },
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  };
}
