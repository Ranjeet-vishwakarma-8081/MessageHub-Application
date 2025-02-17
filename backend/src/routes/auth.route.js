import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", protectRoute, checkAuth);

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.put("/update-profile", protectRoute, updateProfile);

export default router;
