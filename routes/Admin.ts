import express from "express";
import { adminAuth } from "../middleware/authorization";
import {
   CreateSuperAdmin, getUsers, loginAdmin
  } from "../controller/adminController";



const router = express.Router();

router.post("/register", CreateSuperAdmin);
router.post("/login", loginAdmin);
router.get("/get-all-user", adminAuth, getUsers);


export default router;