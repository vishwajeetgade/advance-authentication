const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please use a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        select: false,
        minlength: 6
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSiginedToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
}

UserSchema.methods.getResetPasswordToken = function () {
    //get random hex code of 20 bytes
   const resetToken = crypto.randomBytes(20).toString("hex");
    // hashing resetToken
   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
   this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

   return resetToken;
}

const User = mongoose.model("User", UserSchema);
module.exports = User;