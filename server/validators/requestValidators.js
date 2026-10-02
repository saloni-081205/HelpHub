const { body } = require('express-validator');
const HelpRequest = require('../models/HelpRequest');

const createRequestValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 120 }).withMessage('Title must be 5–120 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10–1000 characters'),
  body('category')
    .isIn(HelpRequest.CATEGORIES)
    .withMessage(`Category must be one of: ${HelpRequest.CATEGORIES.join(', ')}`),
  body('urgency')
    .optional()
    .isIn(HelpRequest.URGENCIES)
    .withMessage(`Urgency must be one of: ${HelpRequest.URGENCIES.join(', ')}`),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 150 }).withMessage('Location too long'),
  body('contactName')
    .trim()
    .notEmpty().withMessage('Contact name is required'),
  body('contactPhone')
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Valid contact phone is required'),
  body('requiredDate')
    .notEmpty().withMessage('Required date is required')
    .isISO8601().withMessage('Invalid date format'),
];

module.exports = { createRequestValidation };