import User from "../models/user.js";
import Room from "../models/rooms.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // const user = new User({ username, email, password });
    // user.save()
    //   .then(() => res.status(201).json({ message: 'User created successfully' }))
    //   .catch((error) => res.status(500).json({ error: 'Error creating user' }));

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ error: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res
      .status(201)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "User created successfully",
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "User not created",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "User not logged in",
    });
  }
};

const getChat = async (req, res) => {
  try {
    const messages = await Room.find({ name: req.params.room }).populate(
      "messages"
    );

    if (!messages) {
      return res.status(404).json({ error: "Room not found" });
    }

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

export { signUp,login, getChat };
