import { Router } from "express";
import { isAuthenticated } from "../auth.js";
import { isAdmin } from "./auth.js";
import { getAdminDashboardData, getUsersDataTable } from "./controller.js";
const router = Router();

router.get("/dashboard", isAuthenticated, isAdmin, getAdminDashboardData);
router.get("/users-data", isAuthenticated, isAdmin, getUsersDataTable);

export default router;
