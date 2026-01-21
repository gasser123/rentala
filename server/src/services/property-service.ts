import { Location, Prisma, PrismaClient } from "@prisma/client";
import { PropertiesQuery } from "../types/properties/properties-query";
import { wktToGeoJSON } from "@terraformer/wkt";
import { LocationService } from "./location-service";

export class PropertyService {
  constructor(
    private prisma: PrismaClient,
    private locationService: LocationService
  ) {}
  async findFiltered(filters: PropertiesQuery) {
    try {
      const {
        amenities,
        availableFrom,
        baths,
        beds,
        favoriteIds,
        latitude,
        longitude,
        priceMax,
        priceMin,
        propertyType,
        squareFeetMax,
        squareFeetMin,
      } = filters;
      const whereConditions: Prisma.Sql[] = [];
      if (favoriteIds) {
        const favoriteIdsArray = (favoriteIds as string)
          .split(",")
          .map((id) => parseInt(id, 10));
        whereConditions.push(
          Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
        );
      }

      if (priceMin) {
        whereConditions.push(
          Prisma.sql`p."pricePerMonth" >= ${parseFloat(priceMin)}`
        );
      }

      if (priceMax) {
        whereConditions.push(
          Prisma.sql`p."pricePerMonth" <= ${parseFloat(priceMax)}`
        );
      }

      if (beds && beds !== "any") {
        whereConditions.push(Prisma.sql`p."beds" >= ${Number(beds)}`);
      }

      if (baths && baths !== "any") {
        whereConditions.push(Prisma.sql`p."baths" >= ${Number(baths)}`);
      }

      if (squareFeetMin) {
        whereConditions.push(
          Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
        );
      }

      if (squareFeetMax) {
        whereConditions.push(
          Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
        );
      }
      if (propertyType && propertyType !== "any") {
        whereConditions.push(
          Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
        );
      }

      if (amenities && amenities !== "any") {
        const amenitiesArray = amenities.split(",");
        whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
      }

      if (availableFrom && availableFrom !== "any") {
        const availableFromDate =
          typeof availableFrom === "string" ? availableFrom : null;
        if (availableFromDate) {
          const date = new Date(availableFromDate);
          if (!isNaN(date.getTime())) {
            whereConditions.push(Prisma.sql`EXISTS (
            SELECT 1 FROM "Lease" l
            WHERE l."propertyId" = p.id
            AND l."startDate" <= ${date.toISOString()}
           )`);
          }
        }
      }

      if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const radiusInKm = 1000;
        const degrees = radiusInKm / 111; // converts km to degrees
        whereConditions.push(
          Prisma.sql`ST_DWithin(l.coordinates::geometry, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), ${degrees})`
        );
      }

      const completeQuery = Prisma.sql`
      SELECT p.*, json_build_object(
        'id', l.id,
        'address', l.address,
        'city', l.city,
        'state', l.state,
        'country', l.country,
        'postalCode', l."postalCode",
        'coordinates', json_build_object(
          'longitude', ST_X(l.coordinates::geometry),
          'latitude', ST_Y(l.coordinates::geometry)
        )
      ) as location FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${
        whereConditions.length
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
    `;
      const properties = await this.prisma.$queryRaw(completeQuery);
      return properties;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findById(propertyId: number) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        include: { location: true },
      });

      let propertyWithCoordinates;
      if (property) {
        const coordinates = (await this.prisma
          .$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`) as {
          coordinates: string;
        }[];
        const geoJson = wktToGeoJSON(coordinates[0]?.coordinates || "") as {
          coordinates: number[];
        };
        const longitude = geoJson.coordinates[0];
        const latitude = geoJson.coordinates[1];
        propertyWithCoordinates = {
          ...property,
          location: {
            ...property.location,
            coordinates: { longitude, latitude },
          },
        };
      }
      return propertyWithCoordinates;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findPropertyWithLeases(propertyId: number) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          leases: {
            include: {
              tenant: true,
            },
          },
        },
      });

      return property;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(
    propertyInfo: Omit<Prisma.PropertyCreateInput, "location" | "manager">,
    managerCognitoId: string,
    locationData: Omit<Location, "id">,
    longitude: number,
    latitude: number
  ) {
    try {
      const {} = propertyInfo;
      const location = await this.locationService.create(
        locationData,
        longitude,
        latitude
      );
      const newPorperty = await this.prisma.property.create({
        data: {
          ...propertyInfo,
          locationId: location.id,
          managerCognitoId,
        },
        include: { location: true, manager: true },
      });

      return newPorperty;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findByManagerCognitoId(cognitoId: string) {
    try {
      const properties = await this.prisma.property.findMany({
        where: {
          managerCognitoId: cognitoId,
        },
        include: {
          location: true,
        },
      });

      const propertiesWithFormattedLocation = await Promise.all(
        properties.map(async (property) => {
          const coordinates = (await this.prisma
            .$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`) as {
            coordinates: string;
          }[];
          const geoJson = wktToGeoJSON(coordinates[0]?.coordinates || "") as {
            coordinates: number[];
          };
          const longitude = geoJson.coordinates[0];
          const latitude = geoJson.coordinates[1];
          const propertyWithCoordinates = {
            ...property,
            location: {
              ...property.location,
              coordinates: { longitude, latitude },
            },
          };

          return propertyWithCoordinates;
        })
      );

      return propertiesWithFormattedLocation;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findByTenantCognitoId(cognitoId: string) {
    try {
      const properties = await this.prisma.property.findMany({
        where: {
          tenants: {
            some: {
              cognitoId,
            },
          },
        },
        include: {
          location: true,
        },
      });

      const propertiesWithFormattedLocation = await Promise.all(
        properties.map(async (property) => {
          const coordinates = (await this.prisma
            .$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`) as {
            coordinates: string;
          }[];
          const geoJson = wktToGeoJSON(coordinates[0]?.coordinates || "") as {
            coordinates: number[];
          };
          const longitude = geoJson.coordinates[0];
          const latitude = geoJson.coordinates[1];
          const propertyWithCoordinates = {
            ...property,
            location: {
              ...property.location,
              coordinates: { longitude, latitude },
            },
          };

          return propertyWithCoordinates;
        })
      );

      return propertiesWithFormattedLocation;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findPropertyForApplication(propertyId: number) {
    try {
      const property = await this.prisma.property.findUnique({
        where: {
          id: propertyId,
        },
        select: {
          pricePerMonth: true,
          securityDeposit: true,
        },
      });

      return property;
    } catch (error) {
      console.error(error, "Error fetching property for application:");
      throw error;
    }
  }

  async connectPropertyToTenant(propertyId: number, tenantCognitoId: string) {
    try {
      const property = await this.prisma.property.update({
        where: {
          id: propertyId,
        },
        data: {
          tenants: {
            connect: {
              cognitoId: tenantCognitoId,
            },
          },
        },
      });
      return property;
    } catch (error) {
      console.error(error, "error connecting property to tenant");
      throw error;
    }
  }
}
