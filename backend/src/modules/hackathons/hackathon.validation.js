/**
  hackathon.validation.js
  Declares request validation rules for hackathon payloads.
 */
import {body, param} from 'express-validator';

// Validation for hackathonId param
const hackathonIdParamValidation = [
  param('hackathonId')
    .isMongoId()
    .withMessage('Invalid hackathonId format'),
];

export { hackathonIdParamValidation };