import Joi from "joi";

import { emailRegex } from "../constants/users.js";

export const authRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
});

export const authLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
});

export const authRequestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

export const authResetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
