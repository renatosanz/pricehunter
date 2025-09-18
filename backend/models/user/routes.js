import { Router } from "express";
import { isAuthenticated, userLogin } from "./auth.js";
import { getUserData, registerUser } from "./controller.js";
import { validateLogIn, validateRegister } from "./validate.js";
const router = Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogIn, userLogin);

// verificar session
router.get("/session", isAuthenticated, getUserData);

export default router;
