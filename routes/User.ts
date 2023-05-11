import express from "express";
import { auth } from "../middleware/authorization";
import {
    Login,
    Register,
    updateUserProfile,
  } from "../controller/userController";



const router = express.Router();

router.post("/signup", Register);
router.post("/login", Login);
router.patch("/update-profile", auth, updateUserProfile);

export default router;