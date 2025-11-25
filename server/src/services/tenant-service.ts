import { PrismaClient, Tenant } from "@prisma/client";
export class TenantService {
  constructor(private prisma: PrismaClient) {}

  async findOne(cognitoId: string) {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: {
          cognitoId,
        },
        include: {
          favorites: true,
        },
      });
      return tenant;
    } catch (error) {
      console.error("Error finding tenant:", error);
      throw error;
    }
  }

  async create(tenantData: Omit<Tenant, "id">) {
    const { cognitoId, email, phoneNumber, name } = tenantData;
    try {
      const tenant = await this.prisma.tenant.create({
        data: {
          cognitoId,
          email,
          phoneNumber,
          name,
        },
      });
      return tenant;
    } catch (error) {
      console.error("Error creating tenant:", error);
      throw error;
    }
  }

  async update(tenantData: Omit<Tenant, "id">) {
    const { cognitoId, email, phoneNumber, name } = tenantData;
    try {
      const tenant = await this.prisma.tenant.update({
        data: {
          email,
          phoneNumber,
          name,
        },
        where: {
          cognitoId,
        },
      });
      return tenant;
    } catch (error) {
      console.error("Error updating tenant:", error);
      throw error;
    }
  }
}
