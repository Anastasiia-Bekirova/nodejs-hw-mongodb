import createHttpError from "http-errors";


export const validateBody = schema => {
    const func = async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, {
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
