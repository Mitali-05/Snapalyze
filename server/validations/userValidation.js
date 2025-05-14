import { body } from 'express-validator';

export const userRegistrationValidation = [
  // First Name Validation
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),

  // Last Name Validation
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),

  // Email Validation
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),

  // Password Validation
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password should be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain a special character'),

  // Confirm Password Validation
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  // Profession Validation
  body('profession')
    .notEmpty()
    .withMessage('Profession is required')
    .isIn(['unemployed', 'student', 'employee', 'freelancer', 'entrepreneur', 'other'])
    .withMessage('Invalid profession'),

  // Organization Validation (Optional)
  body('organization')
    .optional()
    .isString()
    .withMessage('Organization must be a string'),
];


export const userLoginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];
