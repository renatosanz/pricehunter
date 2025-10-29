import { Router } from "express";
import { isAuthenticated } from "../auth.js";
import { isAdmin } from "./auth.js";
import { getAdminDashboardData } from "./controller.js";
const router = Router();

router.get("/dashboard", isAuthenticated, isAdmin, getAdminDashboardData);

export default router;
