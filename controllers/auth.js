const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({
            username,
            email,
            password
        })

        sendToken(user, 201, res);

    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Provide email and password", 400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorResponse("Invalid Credentials", 401));
        };

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new ErrorResponse("Invalid Credentials", 401));
        };

        sendToken(user, 200, res);

    } catch (error) {
        next(error);
    }
}

exports.forgetpassword = async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) return next(new ErrorResponse("Email can't be send", 404));
        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
        const message = `
            <h1>You have Reset a Password reset</h1>
            <p>Please go to the link to reset your password </p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendEmail({
              to: user.email,
              subject: "Password Reset Request",
              text: message,
            });
      
            res.status(200).json({ success: true, data: "Email Sent" });
          } catch (err) {
            console.log(err);
      
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
      
            await user.save();
      
            return next(new ErrorResponse("Email could not be sent", 500));
          }

    } catch (error) {
        return next(error);
    }
}

exports.resetpassword = async (req, res, next) => {
     // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.resettoken)
  .digest("hex");

try {
  const user = await User.findOne({
    resetPasswordToken,
    // check password expire is still greater than Date.now()
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(201).json({
    success: true,
    data: "Password Updated Success",
    token: user.getSiginedToken(),
  });
} catch (err) {
  next(err);
}
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSiginedToken();
    res.status(statusCode).json({
        success: true,
        token
    });
}

exports.privateRoute = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Valid User"
    })
}