"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema //AnyZodObject
) => async (req, res, next) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateRequest = validateRequest;
