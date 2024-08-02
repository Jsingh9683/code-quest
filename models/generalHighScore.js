// models/generalHighScore.js
const mongoose = require('mongoose');

const generalHighScoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    score: { type: Number, required: true }
});

module.exports = mongoose.model('GeneralHighScore', generalHighScoreSchema);
