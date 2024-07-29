import { Admins } from '../models/admin.js';
import bcryptjs from 'bcryptjs';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js'; // Ensure you have this middleware

const router = Router();
const adminSecret = process.env.ADMIN_SECRET_KEY;

const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: adminSecret,
};

// Create a new admin
router.post("/", authMiddleware, async (req, res) => {
  try {
    const name = req.body.name.toString().trim();
    const email = req.body.email.toString().trim();
    const password = req.body.password.toString();

    const existingAdmin = await Admins.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with given email already exists!" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newAdmin = new Admins({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Validate an admin
router.post("/validate", async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;

      const admin = await Admins.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: "Admin account does not exist" });
      }

      const isMatch = await bcryptjs.compare(password, admin.password);
      if (isMatch) {
        const payload = { id: admin._id };
        const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: "1h" });
        res.json({ signInStatus: "success", token, id: admin._id });
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
    } else {
      res.status(400).json({ message: "Email and password are required" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
