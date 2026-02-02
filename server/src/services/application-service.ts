import { Application, Lease, PrismaClient, Property } from "@prisma/client";
import { LeaseService } from "./lease-service";
import { claculateNextPaymentDate } from "../util/payments";
import { CreateApplicationInput } from "../zod-schemas/create-application-schema";
import { PropertyService } from "./property-service";

export class ApplicationService {
  constructor(
    private prisma: PrismaClient,
    private leaseService: LeaseService,
    private propertyService: PropertyService,
  ) {}
  async findApplications(userId: string, userType: string) {
    try {
      let whereClause = {};
      if (userType === "tenant") {
        whereClause = { tenantCognitoId: userId };
      } else if (userType === "manager") {
        whereClause = {
          property: {
            managerCognitoId: userId,
          },
        };
      }

      const applications = await this.prisma.application.findMany({
        where: whereClause,
        include: {
          property: {
            include: {
              location: true,
              manager: true,
            },
          },
          tenant: true,
        },
      });

      const formattedApplications = await Promise.all(
        applications.map(async (app) => {
          const lease = await this.leaseService.findTenantPropertyLease(
            app.tenantCognitoId,
            app.propertyId,
          );

          return {
            ...app,
            property: {
              ...app.property,
              address: app.property.location.address,
            },
            manager: app.property.manager,
            lease: lease
              ? {
                  ...lease,
                  nextPaymentDate: claculateNextPaymentDate(lease.startDate),
                }
              : null,
          };
        }),
      );
      return formattedApplications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  }

  async create(
    propertyInfo: {
      pricePerMonth: number;
      securityDeposit: number;
    },
    createApplicationInput: CreateApplicationInput,
  ) {
    try {
      const {
        applicationDate,
        email,
        message,
        name,
        phoneNumber,
        status,
        tenantCognitoId,
        propertyId,
      } = createApplicationInput;
      const newApplication = await this.prisma.$transaction(async (tx) => {
        // Create lease first
        const lease = await tx.lease.create({
          data: {
            startDate: new Date(), //today
            endDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1),
            ), // 1 year from today
            rent: propertyInfo.pricePerMonth,
            deposit: propertyInfo.securityDeposit,
            property: {
              connect: {
                id: propertyId,
              },
            },
            tenant: {
              connect: {
                cognitoId: tenantCognitoId,
              },
            },
          },
        });

        // create the application
        const application = await tx.application.create({
          data: {
            applicationDate: new Date(applicationDate),
            status,
            name,
            email,
            phoneNumber,
            message,
            property: {
              connect: {
                id: propertyId,
              },
            },
            tenant: {
              connect: { cognitoId: tenantCognitoId },
            },
            lease: {
              connect: {
                id: lease.id,
              },
            },
          },
          include: {
            property: true,
            tenant: true,
            lease: true,
          },
        });
        return application;
      });

      return newApplication;
    } catch (error) {
      console.error(error, "error creating application");
      throw error;
    }
  }

  async findUnique(id: number) {
    try {
      const application = await this.prisma.application.findUnique({
        where: {
          id,
        },
        include: {
          property: {
            include: {
              manager: true,
            },
          },
          tenant: true,
        },
      });
      return application;
    } catch (error) {
      console.error(error, "error finding application");
      throw error;
    }
  }

  async updateApplicationStatus(
    application: Application & { property: Property },
    status: Application["status"],
  ) {
    try {
      let updatedApplication;
      if (status === "Approved") {
        const newLease = await this.leaseService.create({
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          rent: application.property.pricePerMonth,
          deposit: application.property.securityDeposit,
          propertyId: application.propertyId,
          tenantCognitoId: application.tenantCognitoId,
        });
        // update the property to connect to the tenant
        await this.propertyService.connectPropertyToTenant(
          application.propertyId,
          application.tenantCognitoId,
        );

        // Update the application with the new lease ID
        updatedApplication = await this.prisma.application.update({
          where: {
            id: application.id,
          },
          data: {
            status,
            leaseId: newLease.id,
          },
          include: {
            property: true,
            tenant: true,
            lease: true,
          },
        });
      } else {
        // update the application status for "Denied" and "Pending"
        updatedApplication = await this.prisma.application.update({
          where: {
            id: application.id,
          },
          data: {
            status,
          },
          include: {
            property: true,
            tenant: true,
            lease: true,
          },
        });
      }

      return updatedApplication;
    } catch (error) {
      console.error(error, "error updating application status");
      throw error;
    }
  }
}
