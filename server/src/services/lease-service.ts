import { Lease, PrismaClient } from "@prisma/client";

export class LeaseService {
  constructor(private prisma: PrismaClient) {}

  async getLeases() {
    try {
      const leases = await this.prisma.lease.findMany({
        include: {
          tenant: true,
          property: true,
        },
      });

      return leases;
    } catch (error) {
      console.error("Error fetching leases:", error);
      throw error;
    }
  }

  async getLeasePayments(id: number) {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          leaseId: id,
        },
      });
      return payments;
    } catch (error) {
      console.error("Error fetching lease payments:", error);
      throw error;
    }
  }

  async findTenantPropertyLease(tenantCognitoId: string, propertyId: number) {
    try {
      const lease = await this.prisma.lease.findFirst({
        where: {
          tenant: {
            cognitoId: tenantCognitoId,
          },
          propertyId,
        },
        orderBy: {
          startDate: "desc",
        },
      });

      return lease;
    } catch (error) {
      console.error("Error finding tenant property lease:", error);
      throw error;
    }
  }

  async create(leaseInfo: Omit<Lease, "id">) {
    try {
      const lease = await this.prisma.lease.create({
        data: leaseInfo,
      });
      return lease;
    } catch (error) {
      console.error(error, "error creating lease");
      throw error;
    }
  }
}
