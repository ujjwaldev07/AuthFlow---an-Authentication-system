import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  role: z.enum(["user", "admin"]).default("user"),
  adminKey: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    if (data.role === "admin" && data.adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
      return res.status(403).json({ message: "Invalid admin registration key." });
    }

    const exists = await User.findOne({ email: data.email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const password = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password,
      role: data.role
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: err.issues?.[0]?.message ?? "Invalid input." });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email.toLowerCase() }).select("+password");

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Please enter a valid email and password." });
    }
    next(err);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }
  });
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully." });
});

export default router;
