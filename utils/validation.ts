import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';
import Joi from 'joi/lib';
import { AuthPayLoad } from '../interface/Auth.dt.o';
import {APP_SECRET} from '../config';



export const option = {
  abortEarly: false,
  errors: {
    wrap : {
      label: ''
    }
  }
}


export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
});



export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});



export const updateSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName:Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
});





export const adminSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),  
  confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
});







export const GenerateSalt = async()=>{
   return await bcrypt.genSalt()
}


export const GeneratePassword = async(password:string, salt:string)=>{
  return await bcrypt.hash(password, salt)
}


export const GenerateSignature = async(payLoad: AuthPayLoad, )=>{
  return jwt.sign(payLoad, APP_SECRET, {expiresIn: "1d"})
}


export const verifySignature = async(signature: string) => {
  return jwt.verify(signature, APP_SECRET) as JwtPayload
}


export const validatePassword = async(enteredPassword: string, savedPassword: string, salt: string) => {
  return await GeneratePassword(enteredPassword, salt) === savedPassword
}




