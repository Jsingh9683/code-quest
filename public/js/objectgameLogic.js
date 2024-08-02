// document.addEventListener('DOMContentLoaded', function () {
const resultCorrect = document.querySelector('div#correct');
const resultIncorrect = document.querySelector('div#incorrect');
const h1Instructions = document.querySelector('h1.instructions');
const divGame = document.querySelector('.game');
const divAnswer1 = divGame.querySelector('.answer-1');
const divAnswer2 = divGame.querySelector('.answer-2');
const divAnswer3 = divGame.querySelector('.answer-3');
const currentQuestionElement = document.querySelector('#current-question');
const currentScoreElement = document.querySelector('#current-score');
const OPTIONS = {
	'yellow': 0,
	'green': 1,
	'blue': 2
};

let currentQuestion = 1; // Start question number at 1
let score = 0;
const TOTAL_QUESTIONS = 10;
let GAME_ANSWER;
let actionsDisabled = false;

// Attach event listeners to option buttons
document.querySelector('button#yellow').addEventListener('click', () => {
	optionSelected(OPTIONS['yellow']);
});

document.querySelector('button#green').addEventListener('click', () => {
	optionSelected(OPTIONS['green']);
});

document.querySelector('button#blue').addEventListener('click', () => {
	optionSelected(OPTIONS['blue']);
});

document.querySelector('button#return-main-menu').addEventListener('click', () => {
	window.location.href = 'logicalgames';
	initialGameState();
});

// Retrieve user info from local storage
const userJson = localStorage.getItem("user");
const user = JSON.parse(userJson); // Parse the JSON string to get user details
const userId = user.id; // Extract the actual user ID
const userEmail = user.email;

function startGame() {
	currentQuestion = 1; // Reset to 1 at the start of the game
	score = 0;
	updateScoreAndQuestion();
	localStorage.removeItem('objectGameScore');

	play();
}



function saveHighScore(userId, email, score) {
	console.log('Saving high score:', score);
	fetch('/api/save-object-high-score', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ userId, email, score })
	})
		.then(response => response.json())
		.then(data => {
			console.log('Score saved:', data);
		})
		.catch(error => {
			console.error('Error saving score:', error);
		});
}


function saveScore(userId, email, score) {
	console.log('Saving score:', score);
	fetch('/api/save-object-score', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ userId, email, score })
	})
		.then(response => response.json())
		.then(data => {
			console.log('Score saved:', data);
		})
		.catch(error => {
			console.error('Error saving score:', error);
		});
}
//------------------

function fetchHighScore() { console.log('Fetching high score for user:', userId); fetch('/api/get-high-score-object', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) }).then(response => response.json()).then(data => { if (data.error) { console.error(data.error); return; } const objecthighScore = data.highScore || 0; localStorage.setItem('objecthighScore', objecthighScore); console.log('High score saved to local storage:', objecthighScore); }).catch(error => console.error('Error:', error)); }
//--------------

function endGame() {
	console.log('End game with score:', score);
	localStorage.setItem('objectGameScore', score);
	saveScore(userId, userEmail, score);
	saveHighScore(userId, userEmail, score);
	// fetchHighScore();
	window.location.href = "/end-object"; // Redirect to end page
}

function play() {
	if (currentQuestion <= TOTAL_QUESTIONS) {
		gameObjectDetection();
	} else {
		endGame();
	}
}

function updateScoreAndQuestion() {
	currentQuestionElement.textContent = `Question: ${currentQuestion}`;
	currentScoreElement.textContent = `Score: ${score}`;
}

function gameObjectDetection() {
	const reagents = generateAnimalAnswers();
	let animalName = reagents.options[reagents.answer].name.toUpperCase();
	h1Instructions.textContent = "Choose the animal: " + animalName;
	divAnswer1.style.backgroundImage = `url("${reagents.options[0].img}")`;
	divAnswer2.style.backgroundImage = `url("${reagents.options[1].img}")`;
	divAnswer3.style.backgroundImage = `url("${reagents.options[2].img}")`;
	GAME_ANSWER = reagents.answer;
}

function optionSelected(option) {
	if (actionsDisabled) return;

	actionsDisabled = true;
	divGame.classList.add('hidden');

	if (option === GAME_ANSWER) {
		resultCorrect.classList.remove('hidden');
		score += 10;
	} else {
		resultIncorrect.classList.remove('hidden');
	}

	setTimeout(() => {
		divGame.classList.remove('hidden');
		resultCorrect.classList.add('hidden');
		resultIncorrect.classList.add('hidden');
		actionsDisabled = false;

		// Increment question number
		currentQuestion++;
		updateScoreAndQuestion();

		if (currentQuestion <= TOTAL_QUESTIONS) {
			play();
		} else {
			endGame();
		}
	}, 2000);
}

function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
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

function generateAnimalAnswers(n = 3) {
	let options = [randomAnimal()];
	for (let i = 1; i < n; i++) {
		options.push(randomAnimal(options));
	}
	let answer = Math.floor(Math.random() * n);
	return {
		options: options,
		answer: answer
	};
}

// Start the game when the DOM is fully loaded
startGame();
fetchHighScore()

// });
