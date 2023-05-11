import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import bcrypt from 'bcrypt';
import { GeneratePassword, GenerateSalt, GenerateSignature, adminSchema, loginSchema, option } from "../utils/validation";
import { AdminAttributes, AdminInstance, } from "../models/adminModel";
import { UserInstance } from "../models/userModel";
import { WhereOptions } from "sequelize";





/** ================= Super Admin ===================== **/
export const CreateSuperAdmin = async (req: JwtPayload, res: Response) => {
    try {
      const { email, phone, password, confirm_password } = req.body;



      const { error } = adminSchema.validate(req.body, option);
        if (error) {
          return res.status(400).json({
            Error:error.details[0].message,
          });
        }
  

      const salt = await GenerateSalt();
      const adminPassword = await GeneratePassword(password, salt);


      const adminEmail = await AdminInstance.findOne({ where: {email : email }})

      if(adminEmail){
        return res.status(400).json({ message: "Email already registered please login"})
      }

       const adminPhone = await AdminInstance.findOne({ where: {email: email}})

       if(adminPhone){
        return res.status(400).json({ message: "Phone number already registed"})
       }


       await AdminInstance.create({
          id: uuid(),
          email,
          password: adminPassword,
          salt,
          role: "superadmin",
        });
  
        // check if the admin exist
        const admin = (await AdminInstance.findOne({
          where: { email: email },
        })) as unknown as AdminAttributes;

  
        //Generate signature for user
        let signature = await GenerateSignature({
            id: admin.id,
            email: admin.email,
            role: admin.role
        });
  
        return res.status(201).json({
          message: "Admin created successfully",
          signature,

        });
      } catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin",
        });
    }
};





// ** =================== Login Admin ==================== **/
export const loginAdmin = async (req: JwtPayload, res: Response) => {
    try {
    
      const { email, password } = req.body;
  
      const validateResult = loginSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }

  
      const admin = (await AdminInstance.findOne({
        where: { email: email, role: 'superadmin' },
      })) as unknown as AdminAttributes;



      if(!admin) {
        return res.status(401).json({ message: "UnAuthorized"})
      }


      const validation = await bcrypt.compare(password, admin.password);
  
        if (validation) {
          //Generate Signature for user
          let signature = await GenerateSignature({
            id: admin.id,
            email: admin.email,
            role: admin.role
          });
  
          return res.status(200).json({
            message: "Success",
            signature,
            role: admin.role
          });
        }

      return res.status(400).json({
        Error: "wrong Username or Password",
      });
    } catch (err) {
      res.status(500).json({
        Error: "Internal server Error",
        route: "/users/login",
      });
    }
  };






export const getUsers = async (req: JwtPayload, res: Response) => {
   try {

    const id = req.admin.id

    const admin = await AdminInstance.findByPk(id)

    if(!admin){
      return res.status(401).json({ message: "Your are not Authorized to perform this operation"})
    }

    const user = await UserInstance.findAll()
    
    return res.status(200).json({
      user, 
      message: "Success"
    })
   } catch (error) {
      res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-admin",
   });
   }
}



