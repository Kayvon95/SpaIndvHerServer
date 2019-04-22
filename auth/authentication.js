const config = require("../config/env/env");
const moment = require('moment');
const jwt = require('jwt-simple');

function encodeToken(username) {
    const payload = {
        exp: moment().add(1, 'day').unix(),
        iat: moment().unix(),
        sub: username
    };
    return jwt.encode(payload, config.env.secretkey);
}

function decodeToken(token) {
    // console.log('@decodeToken() input = ' + token);
    try {
        const payload = jwt.decode(token.toString(), config.env.secretkey);
        const now = moment.unix();

        if (now > payload.exp) {
            console.log("The token has expired. (Expiration date > Current date)")
        }
        return payload
    } catch(err){
        console.log('error occured');
    }
}


module.exports = { encodeToken, decodeToken };