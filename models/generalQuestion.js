const mongoose = require('mongoose');

const generalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
    answer: { type: String, required: true }
});

const GeneralQuestion = mongoose.model('GeneralQuestion', generalQuestionSchema);

module.exports = GeneralQuestion;
