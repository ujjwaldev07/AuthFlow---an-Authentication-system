import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { sendAuthNotification } from "../utils/email.js";
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

    const email = data.email.toLowerCase();
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const password = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      name: data.name,
      email,
      password,
      role: data.role
    });

    const token = signToken(user);
    const userResponse = { id: user._id, name: user.name, email: user.email, role: user.role };

    // Fire-and-forget: SMTP/API problems must not delay or fail authentication.
    void sendAuthNotification({ event: "registered", user: userResponse });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: userResponse
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
    const email = data.email.toLowerCase();
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    const userResponse = { id: user._id, name: user.name, email: user.email, role: user.role };

    // Fire-and-forget: authentication remains fast even if the mail provider is slow.
    void sendAuthNotification({ event: "logged in successfully", user: userResponse });

    res.json({
      message: "Login successful",
      token,
      user: userResponse
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

router.post("/logout", protect, (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  };

  // Send before the client removes its token; delivery remains non-blocking.
  void sendAuthNotification({ event: "logged out", user });

  res.json({ message: "Logged out successfully." });
});

export default router;
