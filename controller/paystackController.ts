import { Request, Response } from "express";
import paystack from 'paystack'
import { PAYSTACK_SECRET_KEY } from "../config";
import { Transaction, TransactionAttributes  } from "../models/paystackModel";



export const CreateTransaction = async (req: Request, res: Response) => {
    try {
        const { amount, email } = req.body;

        const reference = `TXN-${Date.now()}`;

        const paystackAPI = paystack(PAYSTACK_SECRET_KEY);


        const transaction = await paystackAPI.transaction.initialize ({
            amount: amount * 100,
            email,
            reference,
            callback_url: "http://localhost:5000/transactions/callback",
            name: ""
        });


          await Transaction.create ({
            amount,
            reference,
            status: "initiated"
          }) 

          res.json({
            authorization_url: transaction.data.authorization_url
          });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error"); 
    }
}







export const TransactionCallBack = async (req: Request, res: Response) => {
    try {
        const { reference } = req.body;

        const paystackAPI = paystack(PAYSTACK_SECRET_KEY);

        const transaction = await paystackAPI.transaction.verify(reference);


        await Transaction.update({
            status: transaction.data.status
          }, {
            where: {
              reference
            }
          });

          res.send("Transaction complete");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}











  

