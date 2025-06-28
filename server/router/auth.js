const express = require("express");
const { body } = require("express-validator");

const authController = require("../controller/auth");

const router = express.Router();

router.get("/verify/:token", authController.verifyToken);

router.post(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").notEmpty().withMessage("Password is required"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  authController.signup
);

router.put(
  "/signin",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.signin
);

router.post(
  "/reset-password",
  [body("email").isEmail().withMessage("Please enter a valid email address")],
  authController.resetPassword
);

router.put(
  "/reset-password/:token?",
  [
    body("password").notEmpty().withMessage("Password is required"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  authController.getNewPassword
);

module.exports = router;
