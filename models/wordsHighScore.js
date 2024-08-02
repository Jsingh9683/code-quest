// models/wordsHighScore.js
const mongoose = require('mongoose');

const wordsHighScoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    score: { type: Number, required: true }
});

module.exports = mongoose.model('wordsHighScore', wordsHighScoreSchema);
