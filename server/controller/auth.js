const { validationResult } = require("express-validator");
const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const user = require("../models/user");

exports.verifyToken = async (req, res, next) => {
  const { token } = req.params;
  const error = new Error();
  if (!token) {
    error.message = "A token is required";
    error.statusCode = 400;
    return next(error);
  }
  try {
    const verifyToken = await JWT.verify(token, process.env.JWT_KEY);
    if (!verifyToken) {
      error.message = "Invalid Token";
      error.statusCode = 400;
      return next(error);
    }

    const findUser = await User.findById(verifyToken._id);
    if (!findUser) {
      error.message = "User not found";
      error.statusCode = 404;
      return next(error);
    }

    res.status(202).json({
      message: "User Verified",
    });

    console.log(verifyToken);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = Error("Validation Failed");
    error.statusCode = 422;
    return next(error);
  }

  const { username, email, password } = req.body;
  // Check Email Exist
  try {
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      const error = new Error("This email already existed");
      error.statusCode = 409;
      return next(error);
    }

    const hashPW = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashPW,
    });

    const userCreated = await user.save();

    const token = await JWT.sign(
      {
        username,
        email,
        _id: userCreated._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    res.status(202).json({
      message: "User Created Succesfully",
      token,
    });

    const sendingMail = await transporter.sendMail({
      to: email,
      from: process.env.GMAIL_USER,
      subject: "SignUp Succeeded! Welcome To my TODO Task",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #4CAF50; font-size: 28px;">Welcome to TODO Task, ${
          username || "User"
        }!</h1>
        <p style="font-size: 16px; color: #555;">We're thrilled to have you on board. TODO Task is here to help you organize your tasks, stay productive, and achieve your goals with ease.</p>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <h3 style="color: #333;">Here's what you can do with TODO Task:</h3>
        <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
          <li><strong>Organize</strong> your tasks effortlessly.</li>
          <li><strong>Set reminders</strong> so you never miss a deadline.</li>
          <li><strong>Track progress</strong> and accomplish your goals faster.</li>
        </ul>
        <p style="margin-top: 20px;">
          Ready to get started? 
          <a href="http://your-app-url.com" style="color: #4CAF50; font-weight: bold; text-decoration: none;">Log in now</a> and explore the possibilities.
        </p>
      </div>
      <footer style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">Welcome again, and happy tasking!</p>
        <p style="font-style: italic; margin: 5px 0;">- The TODO Task Team</p>
        <p style="margin: 0;">If you have any questions, feel free to contact us at <a href="mailto:support@danisthProjects.com" style="color: #4CAF50;">support@danisthProjects.com</a>.</p>
      </footer>
    </div>
  `,
    });
    console.log(sendingMail);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.signin = async (req, res, next) => {
  const error = new Error();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = Error("Validation Failed");
    error.statusCode = 422;
    return next(error);
  }

  const { email, password } = req.body;
  const foundEmail = await User.findOne({ email });
  if (!foundEmail) {
    error.message = "Invalid email or password";
    error.statusCode = 401;
    return next(error);
  }

  const comparePw = await bcrypt.compare(password, foundEmail.password);
  if (!comparePw) {
    error.message = "Invalid email or password";
    error.statusCode = 401;
    return next(error);
  }

  const token = await JWT.sign(
    {
      username: foundEmail.username,
      email: foundEmail.email,
      _id: foundEmail._id,
    },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );

  res.status(202).json({
    token,
  });
};

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;
  const error = new Error();
  let token;
  // console.log("Reset PW");
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      error.statusCode = 500;
      error.message = "Something Went wrong restaring password";
      return next(error);
    }

    token = buffer.toString("hex");
  });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: "No account with that email found ",
      });
    }
    console.log(user);
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 600000; // 10 minutes
    await user.save();
    const sendingMail = await transporter.sendMail({
      to: email,
      from: process.env.GMAIL_USER,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #FF5722; font-size: 28px;">Password Reset Request</h1>
            <p style="font-size: 16px; color: #555;">Hello ${
              user.username || "User"
            },</p>
            <p style="font-size: 16px; color: #555;">We received a request to reset your password. If you made this request, please click the link below. The link will expire in <strong>10 minutes</strong>.</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd; text-align: center;">
            <p style="margin: 20px 0; color: #555;">Click the button below to reset your password:</p>
            <a href="${[
              process.env.SERVER_HOST,
            ]}/auth/reset-password/${token}" style="display: inline-block; background-color: #FF5722; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Reset Password</a>
            <p style="margin-top: 20px; font-size: 14px; color: #999;">If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <footer style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p style="margin: 0;">Need help? Contact us at <a href="mailto:support@danisthProjects.com" style="color: #FF5722;">support@danisthProjects.com</a>.</p>
            <p style="margin: 5px 0; font-style: italic;">- The TODO Task Team</p>
          </footer>
        </div>
      `,
    });
    console.log(sendingMail);
    res.status(202).json({
      message: "Please check your email to reset the password",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = Error("Validation Failed");
    error.statusCode = 422;
    return next(error);
  }
  const { token } = req.params;
  const { password } = req.body;
  const error = new Error();
  if (!token) {
    error.message = "A token is required";
    error.statusCode = 400;
    return next(error);
  }
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      error.message = "Token Invalid";
      error.statusCode = 400;
      return next(error);
    }

    const newPassword = await bcrypt.hash(password, 12);
    user.password = newPassword;
    user.resetToken = "";
    user.resetTokenExpiration = Date.now();
    await user.save();
    res.status(202).json({
      message: "Password Changed Sucessfully",
    });
  } catch (error) {}
};
