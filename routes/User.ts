import express from "express";
import { userAuth } from "../middleware/authorization";
import {
    Login,
    Register,
    updateUserProfile,
  } from "../controller/userController";



const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.patch("/update-profile", userAuth, updateUserProfile);

export default router;