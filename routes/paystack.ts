import express from "express";
import { CreateTransaction, TransactionCallBack } from "../controller/paystackController";



const router = express.Router();

router.post("/transactions", CreateTransaction);
router.post("/transactions/callback", TransactionCallBack);



export default router;