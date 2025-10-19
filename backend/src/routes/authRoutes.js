const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const authController = require("../controllers/authController");

const signUpValidationRules = [
    body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({max:30}).withMessage("Name cannot exceed 30 characters"),
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email address is invalid"), 
    body("password")
    .notEmpty().withMessage("Password is required")
    .isStrongPassword().withMessage("Enter a strong password with at least one lowercase, uppercase character, number, special character and minimum character length of 8 and maximum of 16")
    .isLength({max:16}).withMessage("Password cannot exceed 16 characters"),
    body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["student", "staff", "admin"]).withMessage("Role must be either student or staff or admin")
];

const loginValidationRules = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email address is invalid"),    
    body("password")
    .notEmpty().withMessage("Password is required")
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg),
    });
  }
  next();
};

router.post("/signup", signUpValidationRules, validate, authController.signup);
router.post("/login", loginValidationRules, validate, authController.login);
router.post("/logout", authController.logout);

module.exports = router;