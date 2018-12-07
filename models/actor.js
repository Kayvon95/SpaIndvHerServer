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
        type: Number
    },
    isDirector: {
        type: Boolean,
        required: true,
        default: 0
    },
});

const Actor = mongoose.model('actor', ActorSchema);
module.exports = Actor;