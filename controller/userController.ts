import { Request, Response } from "express";
import { UserInstance } from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { GeneratePassword, GenerateSalt, GenerateSignature, loginSchema, option, registerSchema, updateSchema } from "../utils/validation";
import { UserAttributes } from "../interface/UserAttributes";
import bcrypt from 'bcrypt';




export const Register = async (req: Request, res: Response) => {
    try {
        const { email, phone, password, confirm_password } = req.body;

        
        const { error } = registerSchema.validate(req.body, option);
        if (error) {
          return res.status(400).json({
            Error:error.details[0].message,
          });
        }


        const userEmail = await UserInstance.findOne({ where: { email: email}})

        if(userEmail) {
            return res.status(400).json({ message : "Email already exist please login"})
        }

        const phoneNumber = await UserInstance.findOne({ where: {phone : phone}})

        if(phoneNumber) {
            return res.status(400).json({ message : "Email already exist please login"})
        }


        const salt = await GenerateSalt();
        const hash = await GeneratePassword(password, salt);

        const user = await UserInstance.create({
            id: uuid(),
            email,
            password: hash,
            firstName: "",
            lastName: "",
            salt,
            address: "",
            phone,
            role: "user",
        })


        const User = (await UserInstance.findOne({
          where: { email: email },
        })) as unknown as UserAttributes; 



      let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
      });

      return res.status(201).json({
        message: "User created successfully check your email or phone for OTP verification",
        signature,
        User
      });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
        Error: "Internal server Error",
        route: "/users/signup",
        });
        
    }

}




/** =================== Login Users ==================== **/
export const Login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const validateResult = loginSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;
  
      
        // const validation = await validatePassword(password, User.password, User.salt)
        const validation = await bcrypt.compare(password, User.password);
  
        if (validation) {
          //Generate Signature for user
          let signature = await GenerateSignature({
            id: User.id,
            email: User.email,
          });
  
          return res.status(200).json({
            message: "You have successfully Logged in",
            signature,
            email: User.email,
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







  export const updateUserProfile = async (req: JwtPayload, res: Response) => {
    try {
      const id = req.user.id;
      const { firstName, lastName, address, phone } = req.body;
    
      const validateResult = updateSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      // check if the user is a registered user
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;
  
      if (!User) {
        return res.status(400).json({
          Error: "You are not authorised to update your profile",
        });
      }
  
      const updatedUser = (await UserInstance.update(
        {
          firstName,
          lastName,
          address,
          phone,
        },
        { where: { id: id } }
      )) as unknown as UserAttributes;
  
      if (updatedUser) {
        const User = (await UserInstance.findOne({
          where: { id: id },
        })) as unknown as UserAttributes;
        return res.status(200).json({
          message: "You have successfully updated your profile",
          User,
        });
      }
      return res.status(400).json({
        message: "Error occured",
      });
    } catch (err) {
      return res.status(500).json({
        Error: "Internal server Error",
        route: "/users/update-profile",
      });
    }
  };