import { Router } from "express";
import { isAuthenticated, userLogin, userLogOut } from "./auth.js";
import {
  getDashboardData,
  getUserData,
  registerUser,
  updateUser,
} from "./controller.js";
import {
  validateLogIn,
  validateRegister,
  validateUpdateUser,
} from "./validate.js";
const router = Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogIn, userLogin);
router.get("/logout", isAuthenticated, userLogOut);
router.patch("/", isAuthenticated, validateUpdateUser, updateUser);
router.get("/dashboard", isAuthenticated, getDashboardData);

// verificar session
router.get("/session", isAuthenticated, getUserData);

export default router;
