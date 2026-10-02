const { body } = require('express-validator');

const strongPassword = (field = 'password') =>
  body(field)
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number');

const validEmail = (field = 'email') =>
  body(field)
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail();

const validPhone = (field = 'phone') =>
  body(field)
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Please provide a valid phone number');

const nonEmpty = (field, label) =>
  body(field).trim().notEmpty().withMessage(`${label} is required`);

const registerValidation = [
  nonEmpty('firstName', 'First name'),
  nonEmpty('lastName', 'Last name'),
  validEmail('email'),
  strongPassword('password'),
  validPhone('phone'),
  body('role')
    .optional()
    .isIn(['requester', 'volunteer', 'admin'])
    .withMessage('Role must be requester, volunteer, or admin'),
];

const loginValidation = [validEmail('email'), nonEmpty('password', 'Password')];

module.exports = {
  registerValidation,
  loginValidation,
  strongPassword,
  validEmail,
  validPhone,
  nonEmpty,
};