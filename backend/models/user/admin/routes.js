import { Router } from "express";
import { isAuthenticated } from "../auth.js";
import { isAdmin } from "./auth.js";
import {
  createUser,
  deleteUser,
  getAdminDashboardData,
  getUsersDataTable,
} from "./controller.js";
import { validateNewUserByAdmin } from "./validate.js";
const router = Router();

router.post(
  "/create-user",
  isAuthenticated,
  isAdmin,
  validateNewUserByAdmin,
  createUser
);
router.delete("/delete-user/:id", isAuthenticated, isAdmin, deleteUser);
router.get("/dashboard", isAuthenticated, isAdmin, getAdminDashboardData);
router.get("/users-data", isAuthenticated, isAdmin, getUsersDataTable);

export default router;
