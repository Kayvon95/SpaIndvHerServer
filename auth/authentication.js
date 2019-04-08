const env = require("../config/env/env");
const moment = require('moment');
const jwt = require('jwt-simple');

function encodeToken(name) {
    const payload = {
        exp: moment.add(10, 'days').unix(),
        iat: moment.unix(),
        sub: name
    };
    return jwt.encode(payload, env.secretkey);
}

// iss: The issuer of the token
// sub: The subject of the token
// aud: The audience of the token
// exp: This will probably be the registered claim most often used. This will define the expiration in NumericDate value.
//     nbf: Defines the time before which the JWT MUST NOT be accepted for processing
//     iat: The time the JWT was issued. Can be used to determine the age of the JWT
// jti: Unique identifier for the JWT. Can be used to prevent the JWT from being

function decodeToken(token, cb) {
    try {
        const payload = jwt.decode(token, env.secretkey);

        const now = moment.unix();

        if (now > payload.exp) {
            console.log("The token has expired. (Expiration date > Current date)")
        }

        cb(null, payload)
    } catch(err){
        cb(err, null)
    }
}

module.exports = { encodeToken, decodeToken };