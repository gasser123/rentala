import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/auth-middleware";
import { tenantRoutes } from "./routes/tenant-routes";
import { managerRoutes } from "./routes/manager-routes";
import { propertyRoutes } from "./routes/property-routes";
import { leaseRoutes } from "./routes/lease-routes";
import { applicationRoutes } from "./routes/application-routes";

/* Configurations */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

/* Routes */
app.get("/", (req, res) => {
  res.send("This is Home route");
});

app.use("/properties", propertyRoutes);
app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
app.use("/managers", authMiddleware(["manager"]), managerRoutes);
app.use("/leases", leaseRoutes);
app.use("/applications", applicationRoutes);

/* Server */
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
