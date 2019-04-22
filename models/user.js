/**
 * Created by Kayvon Rahimi on 20-11-2018.
 */
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    passwordHash: {
        type: String
    }
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    console.log('hashed password: ' + password)
};

UserSchema.methods.validatePassword = function(password) {
    console.log('@user.validatePassword: Password received = ' + password );
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    console.log('@user.validatePassword: Password hashed = ' + hash);
    //If given password + salt equals saved hash, return true
    return this.passwordHash === hash;
};

const User = mongoose.model('user', UserSchema);


module.exports = User;
