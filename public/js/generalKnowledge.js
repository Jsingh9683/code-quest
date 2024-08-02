const questionElement = document.getElementById("question");
const choicesElements = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

const SCORE_POINTS = 10;
const MAX_QUESTIONS = 10;

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [];

    // Fetch questions from the server using Fetch API
    fetch('/api/get-questions')
        .then(response => response.json())
        .then(data => {
            availableQuestions = data;
            getNewQuestion();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            // Handle errors gracefully, e.g., display an error message
        });
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        endGame();  // Call endGame here
        return;
        // return window.location.assign("/end");
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    questionElement.innerText = currentQuestion.question;

    choicesElements.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion[number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

choicesElements.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        const correctAnswer = currentQuestion.answer;
        const classToApply = selectedAnswer === correctAnswer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(SCORE_POINTS);
        } else {
            decrementScore(SCORE_POINTS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

function decrementScore(num) {
    if (score - num < 0) {
        score = 0;
    } else {
        score -= num;
    }
    scoreText.innerText = score;
}




// ------------------HIGH SCORE and CURRENT SCORE DISPLAY --------------------------------------------------------------------------------




document.addEventListener('DOMContentLoaded', function () {
    // Assuming you have the user ID stored in localStorage
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userId = user.id;

    function fetchScores() {
        // Fetch final score (assuming it was set in localStorage or passed in some way)
        const finalScore = localStorage.getItem("mostRecentScore") || "0";
        document.getElementById("finalScore").innerText = `Score in this round is: ${finalScore}`;

        // Fetch high score
        fetch('/api/get-high-score-g', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    document.getElementById("highScore").innerText = "Unable to retrieve high score.";
                    return;
                }

                const highScore = data.highScore || 0;
                document.getElementById("highScore").innerText = `Your High Score: ${highScore}`;
            })
            .catch(error => console.error('Error:', error));
    }

    fetchScores();
});

























document.addEventListener('DOMContentLoaded', function () {
    const exitButtonGame = document.getElementById('exitGame');

    if (exitButtonGame) {
        exitButtonGame.addEventListener('click', function () {
            window.location.href = '/stuDashboard';
        });
    }
});














function getUserInfo() {
    const userString = localStorage.getItem('user');

    if (!userString) {
        console.error('No user info found in localStorage.');
        return null;
    }

    try {
        const user = JSON.parse(userString);
        console.log('User info parsed successfully:', user);
        return user;
    } catch (error) {
        console.error('Failed to parse user info from localStorage:', error);
        return null;
    }
}





function endGame() {
    const userJson = localStorage.getItem("user"); // Retrieve the JSON string
    const score = localStorage.getItem("mostRecentScore"); // Retrieve the score

    if (!userJson || !score) {
        console.error('User ID or score is missing');
        return;
    }

    try {
        const user = JSON.parse(userJson); // Parse the JSON string to get user details
        const userId = user.id; // Extract the actual user ID
        const email = user.email; // Extract the email

        if (!userId || !email || isNaN(parseInt(score))) {
            console.error('User ID or email or score is invalid');
            return;
        }

        fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, email, score: parseInt(score) })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Score saved successfully:', data);
                window.location.assign("/end");
            })
            .catch(error => {
                console.error('Error saving score:', error);
            });
    } catch (error) {
        console.error('Error parsing user ID:', error);
    }
}














startGame();
