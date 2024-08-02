let n1;
let n2;
let opSelector;
let ansOpt;
let answer;
let qNo = document.getElementById("Qno");
let score = document.getElementById("score");
let question = document.getElementById("question");
let buttons = document.getElementsByTagName("button");
let start = document.getElementById("start-btn");
let fScore = document.getElementById("final-score");
let startBox = document.getElementById("start-game");
let gameBox = document.getElementById("in-game");
let endBox = document.getElementById("end-game");
let progress = document.getElementById("progress");
let message = document.getElementById("message");
let operator = ['+', '-', '*', '/'];
let t;
let hscore = document.getElementById("high-score");
let currentScore = 0; // Define a variable to store the score

function restart() {
    currentScore = 0;
    score.innerHTML = "0";
    qNo.innerHTML = "0";
    nextQuestion();

    gameBox.style.display = "block"
    startBox.style.display = "none";
    endBox.style.display = "none";
    timer.style.display = "block";

}



function nextQuestion() {

    progress.style.width = "100%";

    // Check if game is finished
    if (parseInt(qNo.innerText) === 10) {
        clearInterval(t); // Stop the timer
        whenFinished();
        return; // Exit the function to prevent further execution
    }


    timed();




    n1 = Math.floor(Math.random() * 100);
    n2 = Math.floor(Math.random() * 100);
    opSelector = operator[Math.floor(Math.random() * 4)];

    if (opSelector == "/") {
        for (let i = 0; i < 200; i++) {
            if (n1 % n2 == 0 && n1 != 0 && n2 != 0 && n2 != 1 && n1 != n2) {
                break;
            }
            n1 = Math.floor(Math.random() * 100);
            n2 = Math.floor(Math.random() * 100);
        }
    }

    if (opSelector == "*") {
        for (let i = 0; i < 100; i++) {
            if (n1 * n2 <= 1000) {
                break;
            }
            n1 = Math.floor(Math.random() * 50);
            n2 = Math.floor(Math.random() * 50);
        }
    }
    question.innerHTML = n1 + opSelector + n2;
    answer = eval(question.innerHTML);
    question.innerHTML = question.innerHTML + " = ?";

    // console.log("answer: " + answer);
    getOptions();
    getQNo();

}

function getOptions() {

    for (let i = 0; i < 4; i++ && i != ansOpt) {
        if (answer > 100) {
            buttons[i].innerHTML = answer + Math.floor(Math.random() * answer * 0.4);
        } else if (answer > 30 && answer < 100) {
            buttons[i].innerHTML = answer + Math.floor(Math.random() * answer * 0.6);
        } else {
            buttons[i].innerHTML = Math.floor(Math.random() * 100);
        }

        if (answer < 0) {
            buttons[i].innerHTML = "-" + buttons[i].innerHTML;
        }
    }
    ansOpt = Math.floor(Math.random() * 4);
    buttons[ansOpt].innerHTML = answer;
}

function getQNo() {
    qNo.innerHTML = parseInt(qNo.innerHTML) + 1;

}





function getScore() {
    currentScore += parseInt(progress.style.width); // Increment score based on progress width
    score.innerHTML = currentScore; // Update the displayed score
}


function doWhenCorrect(i) {
    buttons[i].style.color = "#fff";
    buttons[i].style.backgroundColor = "green";
    // getScore();
    currentScore += 10; // Award 100 points for correct answers
    score.innerHTML = currentScore; // Update the displayed score
}

function doWhenIncorrect(i) {
    buttons[i].style.color = "#fff";
    buttons[i].style.backgroundColor = "#fb3640";
    // console.log("wrong");
}

function outro(i) {
    setTimeout(() => {
        nextQuestion();
        buttons[i].style.color = "#000";
        buttons[i].style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    }, 500);
}

function lastmessage() {
    clearInterval(t);
    if (fScore.innerText >= 800) {
        let emoji = "&#128525";
        message.innerHTML = "WOW !! UNBELIEVABLE !!" + emoji;
    } else if (fScore.innerText >= 500) {
        let emoji = "&#128531";
        message.innerHTML = "TOO CLOSE !!" + emoji;
    } else if (fScore.innerText >= 100) {
        let emoji = "&#128549";
        message.innerHTML = "Better luck next time " + emoji;
    } else {
        let emoji = "&#128577";
        message.innerHTML = "Bad Luck " + emoji;
    }
}








//------------------------- API DATA FETCH AND SUBMIT ------------------


// Assuming you have the user information stored in localStorage
const userJson = localStorage.getItem("user");
const user = JSON.parse(userJson); // Parse the JSON string to get user details
const userId = user.id; // Extract the actual user ID
const userEmail = user.email;

function saveMathScore(finalScore) {
    fetch('/api/save-math-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId,
            email: userEmail,
            score: finalScore
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data.message);
            } else if (data.error) {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}




// --------------------------------- API FETCH AND SUBMIT HIGH SCORE---------------------------------


function saveHighScore(finalScore) {
    // Fetch the existing high score for the user first
    fetch('/api/get-high-score-m', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const currentHighScore = data.highScore || 0;



            // Only update if the new score is higher than the current high score
            if (finalScore > currentHighScore) {
                hscore.innerHTML = finalScore;
                fetch('/api/save-high-score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        email: userEmail,
                        score: finalScore
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) {
                            console.log(data.message);
                        } else if (data.error) {
                            console.error(data.error);
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                hscore.innerText = currentHighScore;
                console.log('Score is not high enough to be saved.');

            }
        })
        .catch(error => console.error('Error:', error));
}
















function whenFinished() {
    console.log("Finished.");
    clearInterval(t);
    gameBox.style.display = "none";
    startBox.style.display = "none";
    endBox.style.display = "flex";
    fScore.innerText = currentScore;
    lastmessage();
    saveMathScore(currentScore); // Save the final score
    // console.log(finalScore);
    saveHighScore(currentScore);

}









function timed() {
    t = setInterval(() => {
        let currentWidth = parseInt(progress.style.width);
        console.log("timered") // Get the current width
        if (currentWidth > 0) {
            progress.style.width = (currentWidth - 1) + "%"; // Decrease width
        } else {
            clearInterval(t); // Stop the timer
            nextQuestion(); // Move to the next question
        }
    }, 200);
}

buttons[0].addEventListener('click', () => {
    if (buttons[0].innerText == answer) {
        doWhenCorrect(0);
    } else {
        doWhenIncorrect(0);
    }
    clearInterval(t);
    outro(0);
});
buttons[1].addEventListener('click', () => {
    if (buttons[1].innerText == answer) {
        doWhenCorrect(1);
    } else {
        doWhenIncorrect(1);
    }
    clearInterval(t);
    outro(1);
});
buttons[2].addEventListener('click', () => {
    if (buttons[2].innerText == answer) {
        doWhenCorrect(2);
    } else {
        doWhenIncorrect(2);;
    }
    clearInterval(t);
    outro(2);
});
buttons[3].addEventListener('click', () => {
    if (buttons[3].innerText == answer) {
        doWhenCorrect(3);
    } else {
        doWhenIncorrect(3);
    }
    clearInterval(t);
    outro(3);
});


document.getElementById('exit-btn').addEventListener('click', function () {
    window.location.href = '/stuDashboard'; // Redirect to the student dashboard page
});
