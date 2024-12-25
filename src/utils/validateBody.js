import createHttpError from "http-errors";
import { contactAddSchema } from "../validation/contacts.js";

export const validateBody = schema => {
    const func = async (req, res, next) => {
        try {
            await contactAddSchema.validateAsync(req.body, {
                abortEarle: false,
            });
            next();
        }
        catch (error) {
             next(createHttpError(400, error.message));
        }
    };
    return func;
};
