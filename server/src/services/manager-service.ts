import { PrismaClient, Manager } from "@prisma/client";
export class ManagerService {
  constructor(private prisma: PrismaClient) {}

  async findOne(cognitoId: string) {
    try {
      const manager = await this.prisma.manager.findUnique({
        where: {
          cognitoId,
        },
      });
      return manager;
    } catch (error) {
      console.error("Error finding manager:", error);
      throw error;
    }
  }

  async create(managerData: Omit<Manager, "id">) {
    const { cognitoId, email, name, phoneNumber } = managerData;
    try {
      const existingManager = await this.prisma.manager.findUnique({
        where: {
          cognitoId,
        },
      });

      if (existingManager) {
        throw new Error("Manager with this Cognito ID already exists");
      }
      const manager = await this.prisma.manager.create({
        data: {
          cognitoId,
          email,
          phoneNumber,
          name,
        },
      });
      return manager;
    } catch (error) {
      console.error("Error creating manager:", error);
      throw error;
    }
  }

  async update(managerData: Omit<Manager, "id">) {
    const { cognitoId, email, name, phoneNumber } = managerData;
    try {
      const manager = await this.prisma.manager.update({
        data: {
          email,
          phoneNumber,
          name,
        },
        where: {
          cognitoId,
        },
      });
      return manager;
    } catch (error) {
      console.error("Error updating manager:", error);
      throw error;
    }
  }
}
