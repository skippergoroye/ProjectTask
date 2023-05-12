import express, { Express, Request, Response } from 'express';
import { sequelizeDB } from "./Database/index"
import indexRouter from './routes/Index'
import userRouter from './routes/User'
import adminRouter from './routes/Admin'
import payStackRouter from './routes/paystack'
import dotenv from 'dotenv';
dotenv.config();




sequelizeDB.sync().then(()=>{
  console.log("Db connected successfuly")
}).catch(err=>{
  console.log(err)
})



const app = express();
const port = process.env.PORT;



app.use(express.json())
app.use(express.urlencoded({ extended: false }))



app.use('/',  indexRouter)
app.use('/users', userRouter)
app.use('/admins', adminRouter)
app.use('/paystack', payStackRouter)



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});