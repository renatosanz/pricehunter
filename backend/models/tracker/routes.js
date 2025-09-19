import { Router } from "express";
import { isAuthenticated } from "../user/auth";
import { validateNewTracker } from "./validate";
import { newTracker } from "./controller";

const router = Router();

router.post("/new", isAuthenticated, validateNewTracker, newTracker);

export default router;
