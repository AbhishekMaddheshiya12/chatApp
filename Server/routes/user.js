import express from "express";
const router = express.Router();
import { signUp,getChat,login } from "../controller/user.js";
import authMiddleware from "../middleware/auth.js";

router.post("/signup", signUp);
router.post("/login",login);
router.get("/:room",authMiddleware,getChat);


export default router;