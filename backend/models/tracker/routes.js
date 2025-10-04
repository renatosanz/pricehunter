import { Router } from "express";
import { isAuthenticated } from "../user/auth.js";
import { validateNewTracker } from "./validate.js";
import { allTrackers, newTracker,getTrackerDetails } from "./controller.js";

const router = Router();

router.post("/new", isAuthenticated, validateNewTracker, newTracker);
router.get("/all", isAuthenticated, allTrackers);
router.get("/:id", isAuthenticated, getTrackerDetails);

export default router;
