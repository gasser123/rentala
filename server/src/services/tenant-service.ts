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
      const existingTenant = await this.prisma.tenant.findUnique({
        where: {
          cognitoId,
        },
      });

      if (existingTenant) {
        throw new Error("Tenant with this Cognito ID already exists");
      }
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

  async addFavoriteProperty(cognitoId: string, propertyId: number) {
    try {
      const tenant = await this.findOne(cognitoId);
      if (!tenant) {
        throw new Error("Tenant not found");
      }
      const existingFavorites = tenant.favorites || [];
      let updatedTenant: Tenant | null = null;
      if (!existingFavorites.some((fav) => fav.id === propertyId)) {
        updatedTenant = await this.prisma.tenant.update({
          where: { cognitoId },
          data: {
            favorites: {
              connect: { id: propertyId },
            },
          },
          include: { favorites: true },
        });
      }

      return updatedTenant;
    } catch (error) {
      console.error("Error adding favorite property:", error);
      throw error;
    }
  }

  async removeFavoriteProperty(cognitoId: string, propertyId: number) {
    try {
      const tenant = await this.findOne(cognitoId);
      if (!tenant) {
        throw new Error("Tenant not found");
      }
      const existingFavorites = tenant.favorites || [];
      let updatedTenant: Tenant | null = null;
      if (existingFavorites.some((fav) => fav.id === propertyId)) {
        updatedTenant = await this.prisma.tenant.update({
          where: { cognitoId },
          data: {
            favorites: {
              disconnect: { id: propertyId },
            },
          },
          include: { favorites: true },
        });
      }

      return updatedTenant;
    } catch (error) {
      console.error("Error adding favorite property:", error);
      throw error;
    }
  }
}
