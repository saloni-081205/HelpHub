const { validationResult } = require('express-validator');

/**
 * Wrap a validation chain so controllers don't repeat error checks.
 * Usage: router.post('/', validate([...chains]), controller)
 */
const validate = (chains) => [
  ...chains,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }
    next();
  },
];

module.exports = validate;