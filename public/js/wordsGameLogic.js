const resultCorrect = document.querySelector("div#correct");
const resultIncorrect = document.querySelector("div#incorrect");
const h1Instructions = document.querySelector("h1.instructions");
const divGame = document.querySelector(".game");
const divAnswer1 = divGame.querySelector(".answer-1");
const divAnswer2 = divGame.querySelector(".answer-2");
const divAnswer3 = divGame.querySelector(".answer-3");
const divGamewords = divGame.querySelector(".game-words");
const divGameCat = divGame.querySelector(".game-cat");
const currentQuestionSpan = document.getElementById("current-question");
const currentScoreSpan = document.getElementById("current-score");

let currentQuestion = 1;
let currentScore = 0;

const OPTIONS = {
    yellow: 0,
    green: 1,
    blue: 2,
};

// Retrieve user info from local storage
const userJson = localStorage.getItem("user");
const user = JSON.parse(userJson); // Parse the JSON string to get user details
const userId = user.id; // Extract the actual user ID
const userEmail = user.email;

document.querySelectorAll(".category").forEach((divCat) => {
    divCat.addEventListener("click", () => {
        if (divCat.id === "words") window.location.href = "/wordsGame.html";
    });
});

document
    .querySelector("button#return-main-menu")
    .addEventListener("click", () => {
        window.location.href = "logicalgames";
        initialGameState();
    });

document.addEventListener("DOMContentLoaded", startGame);

function startGame() {
    fetch(`/api/save-high-score-words?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.score !== undefined) {
                console.log(`High Score: ${data.score}`);
                // const high_score2 = data.score
                localStorage.setItem("wordshighScore", data.score);
                // Display the high score somewhere in your UI
            }
            // Start the game
            stopOptionSelectedExecution = false;
            play = gameWords;
            play();
        })
        .catch((error) => {
            console.error("Error fetching high score:", error);
            // Start the game even if fetching high score fails
            stopOptionSelectedExecution = false;
            play = gameWords;
            play();
        });
}

function gameWords() {
    actionsDisabled = false;
    const divWordObject = divGame.querySelector("#word-object");
    const divWordText = divGame.querySelector("#word-text");

    divGamewords.classList.remove("hidden");
    divGameCat.classList.add("words");

    const reagents = generateAnimalWordAnswers();

    h1Instructions.textContent =
        "Choose the missing letter of this animal's name";
    divWordObject.style.backgroundImage = `url("${reagents.object.img}")`;
    divWordText.textContent = reagents.word;

    divAnswer1.innerText = reagents.options[0];
    divAnswer2.innerText = reagents.options[1];
    divAnswer3.innerText = reagents.options[2];

    GAME_ANSWER = reagents.answer;
}

function optionSelected(option) {
    if (stopOptionSelectedExecution) return;

    actionsDisabled = true;
    divGame.classList.add("hidden");

    if (option === GAME_ANSWER) {
        resultCorrect.classList.remove("hidden");
        currentScore += 10;
        currentScoreSpan.textContent = `Score: ${currentScore}`;
    } else {
        resultIncorrect.classList.remove("hidden");
    }

    setTimeout(() => {
        divGame.classList.remove("hidden");
        resultCorrect.classList.add("hidden");
        resultIncorrect.classList.add("hidden");
        actionsDisabled = false;

        if (currentQuestion < 10) {
            currentQuestion++;
            currentQuestionSpan.textContent = `Question: ${currentQuestion}`;
            startGame();
        } else {
            endGame();
        }
    }, 2000);
}

document
    .querySelector("#yellow")
    .addEventListener("click", () => optionSelected(OPTIONS["yellow"]));
document
    .querySelector("#green")
    .addEventListener("click", () => optionSelected(OPTIONS["green"]));
document
    .querySelector("#blue")
    .addEventListener("click", () => optionSelected(OPTIONS["blue"]));

function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

function randomElement(array) {
    return array[randomIndex(array)];
}

function randomArrayElement(array, dontRepeatThese = []) {
    let element;
    do {
        element = randomElement(array);
    } while (dontRepeatThese.includes(element));
    return element;
}

function randomAnimal(dontRepeatThese = []) {
    return randomArrayElement(ANIMALS, dontRepeatThese);
}

function generateAnimalWordAnswers(n = 3) {
    const object = randomAnimal();
    let word = object.name.toUpperCase();
    let options = [];
    let answerIndex;

    do {
        answerIndex = randomIndex(word);
    } while (word[answerIndex] === " ");

    const answerChar = word[answerIndex];
    options.push(answerChar);

    for (let i = 1; i < n; i++) {
        let char;
        if (word.length <= 4) {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            do {
                char = randomElement(letters);
            } while (options.includes(char));
        } else {
            do {
                char = word[randomIndex(word)];
            } while (options.includes(char) || char === " ");
        }
        options.push(char);
    }

    word = word.substring(0, answerIndex) + "_" + word.substring(answerIndex + 1);
    const answer = options.findIndex((char) => char === answerChar);

    return {
        object: object,
        word: word,
        options: options,
        answer: answer,
    };
}

function endGame() {
    localStorage.setItem("wordsgameScore", currentScore);
    fetch("/api/save-score-words", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email: userEmail, score: currentScore }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Score saved:", data);
            // fetchHighScore2();
            window.location.href = "end-words";
        })
        .catch((error) => {
            console.error("Error saving score:", error);
        });
}

// function fetchHighScore2() {
//     console.log("Fetching high score for words user:", userId);

//     fetch(`/api/get-high-score-words?userId=${userId}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.error) {
//                 console.error("Error fetching high score:", data.error);
//                 return;
//             }

//             const wordshighScore = data.highScore || 0;
//             localStorage.setItem("wordshighScore", wordshighScore);
//             console.log("High score words saved to local storage:", wordshighScore);
//         })
//         .catch(error => console.error("Error:", error));
// }



