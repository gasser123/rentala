import { Location, PrismaClient } from "@prisma/client";

export class LocationService {
  constructor(private prisma: PrismaClient) {}

  async create(
    locationData: Omit<Location, "id">,
    longitude: number,
    latitude: number,
  ): Promise<Location> {
    const { address, city, country, postalCode, state } = locationData;
    const [location] = await this.prisma.$queryRaw<
      Location[]
    >`INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates) VALUES(${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)) RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates`;

    return location;
  }
}
