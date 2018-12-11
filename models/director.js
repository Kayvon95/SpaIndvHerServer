/**
 * Created by Kayvon Rahimi on 20-11-2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
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
    isActor: {
        type: Boolean,
        required: true,
        default: 0
    },
    imageUrl: {
        type: String,
        required: true
    },
    movies: {
        type: Schema.Types.ObjectId,
        ref: 'movie'
    }
});

const Director = mongoose.model('director', DirectorSchema);
module.exports = Director;