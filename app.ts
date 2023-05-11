import express, { Express, Request, Response } from 'express';
import { sequelizeDB } from "./Database/index"
import dotenv from 'dotenv';
dotenv.config();




sequelizeDB.sync().then(()=>{
  console.log("Db connected successfuly")
}).catch(err=>{
  console.log(err)
})



const app = express();
const port = process.env.PORT;



app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});