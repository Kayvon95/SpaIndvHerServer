/**
 * Created by Kayvon Rahimi on 20-11-2018.
 */
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    },
    minutes: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    yearOfRelease: {
        //type: Date
        type: Number
    },
    imageUrl: {
        type: String,
        required: true
    },
    actors: {
    type: Schema.Types.ObjectId,
        ref: 'actor'
}
});

const Movie = mongoose.model('movie', MovieSchema);
module.exports = Movie;