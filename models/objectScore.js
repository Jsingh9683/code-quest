const mongoose = require('mongoose');

const objectscoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ObjectScore = mongoose.model('ObjectScore', objectscoreSchema);

module.exports = ObjectScore;
