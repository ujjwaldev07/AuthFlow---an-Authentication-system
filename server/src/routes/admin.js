import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", protect, requireRole("admin"), (req, res) => {
  res.json({
    message: "Welcome to the protected admin dashboard.",
    admin: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

export default router;
