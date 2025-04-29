import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User";
const router = express.Router();
// Register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        return res.status(201).send("User registered");
    }
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).send("Server Error");
    }
});
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate email and password
        if (!email || !password) {
            return res.status(400).send("Please provide both email and password");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).send("JWT_SECRET is not defined");
        }
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
        return res.json({ token });
    }
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).send("Server Error");
    }
});
export default router;
