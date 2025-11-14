import { Router } from "express";
import { createManager, getManager } from "../controllers/manager-controller";
export const managerRoutes = Router();
managerRoutes.get("/:cognitoId", getManager);
managerRoutes.post("/", createManager);
