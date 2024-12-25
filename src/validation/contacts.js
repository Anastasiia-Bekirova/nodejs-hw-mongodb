import Joi, { string } from "joi";
import { contactTypeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20),
    isFavorite: Joi.boolean().required(),
    contactType: Joi.string().min(3).max(20).valid(...contactTypeList).required(),
});


export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: string().min(3).max(20),
    email: Joi.string().min(3).max(20),
    isFavorite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid(...contactTypeList),
});
