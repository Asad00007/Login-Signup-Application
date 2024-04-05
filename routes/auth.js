import { Router } from "express";
import { check, validationResult } from "express-validator";
import prisma from "../DB/db.config.js";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();

router.post(
  "/signup",
  [
    check("email", "Provide a valid Email").isEmail(),
    check("password", "Password should be more than 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { password, email } = req.body;

    //validate input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //validate if user exist
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    const token = await jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 7200,
      }
    );

    return res.json({
      status: 200,
      data: newUser,
      message: "User created successfully",
      token,
    });
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!isUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const correctPassword = await bcrypt.compare(password, isUser.password);
    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: 7200 }
    );
    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.log(`Error:`, error);
  }
});
router.get("/all", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
export default router;
