import { Router } from "express";
import { isAuthenticated } from "../user/auth.js";
import { validateNewTracker, validateRestoreTracker } from "./validate.js";
import {
  allTrackers,
  newTracker,
  getTrackerDetails,
  deleteTracker,
  historyTrackers,
  restoreTracker,
} from "./controller.js";

const router = Router();
router.use(isAuthenticated);

router.post("/", validateNewTracker, newTracker);
router.post("/restore", validateRestoreTracker, restoreTracker);
router.get("/all", allTrackers);
router.get("/history", historyTrackers);
router.get("/:id", getTrackerDetails);
router.delete("/:id", deleteTracker);

export default router;
