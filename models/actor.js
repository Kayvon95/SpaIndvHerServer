const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    yearOfBirth: {
        type: Number,
        required: true
    },
    countryOfOrigin: {
        type: String,
        required: true
    },
    isDirector: {
        type: Boolean,
        required: true,
        default: 0
    },
    imageUrl: {
        type: String,
        required: true
    }
});

const Actor = mongoose.model('actor', ActorSchema);
module.exports = Actor;