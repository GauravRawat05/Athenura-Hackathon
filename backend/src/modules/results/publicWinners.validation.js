import Joi from "joi";
import mongoose from "mongoose";

export const hackathonIdParamValidation = Joi.object({
  hackathonId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "hackathonId validation")
    .messages({
      "any.invalid": "Invalid hackathonId format",
    }),
});
