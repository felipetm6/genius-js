const buttonElements = document.querySelectorAll('.clickable');
const controlElement = document.querySelector('.control .background');
const controlStatusElement = document.querySelector('.control p');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');

let roundAnswers = [];
let playerAnswers = [];
let difficulty = 4;
let intervalDecrease = 0;
let score = 0;
let highScore = 0;

let waitingPlayerAnswer = false;
let canStartRound = true;

const getRandomValueAtArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

function callRound() {
    playerAnswers = [];

    controlElement.style.cursor = 'auto';
    controlElement.style.backgroundColor = 'yellow';
    controlStatusElement.innerHTML = 'Observe';

    const loopLimit = difficulty - roundAnswers.length;

    for (let i = 0; i < loopLimit; i++) {
        const randomValue = getRandomValueAtArray(buttonElements);

        roundAnswers.push(randomValue);
    }

    displaySequence(0);
}

function displaySequence(index) {
    const element = roundAnswers[index];

    setTimeout(() => {
        element.classList.add('active');

        setTimeout(() => {
            element.classList.remove('active');
            index++;

            if (index < roundAnswers.length) {
                displaySequence(index);
            } else {
                waitingPlayerAnswer = true;

                controlElement.style.backgroundColor = 'lightblue';
                controlStatusElement.innerHTML = 'Reproduza';

                toggleButtonsCursorStyle();
            }
        }, 1000 - intervalDecrease)
    }, 1000 - intervalDecrease)
}

function processClick() {
    if (!waitingPlayerAnswer) {
        return;
    }

    playerAnswers.push(this);
    this.classList.add('active');

    setTimeout(() => {
        this.classList.remove('active');
    }, 250);

    if (playerAnswers.length === roundAnswers.length) {
        waitingPlayerAnswer = false;

        toggleButtonsCursorStyle();
        processAnswers();
    }
}

function processAnswers() {
    let allCorrect = true;

    for (let i in roundAnswers) {
        const properAnswer = roundAnswers[i];
        const playerAnswer = playerAnswers[i];

        if (properAnswer !== playerAnswer) {
            allCorrect = false;
        }
    }

    if (allCorrect) {
        controlElement.style.cursor = 'pointer';
        controlElement.style.backgroundColor = 'green';

        controlStatusElement.innerHTML = 'Acertou!';

        setTimeout(() => {
            callRound()
        }, 500);
    } else {
        controlElement.style.cursor = 'pointer';
        controlElement.style.backgroundColor = 'red';

        controlStatusElement.innerHTML = 'Recomeçar';

        canStartRound = true;
    }

    score = (allCorrect) ? score + 1 : score;
    highScore = (score > highScore) ? score : highScore;
    score = (allCorrect) ? score : 0;

    updateScore();
    revampDifficulty(allCorrect);
}

function revampDifficulty(toIncrease) {
    if (toIncrease) {
        difficulty++;
        intervalDecrease = (intervalDecrease < 800) ? intervalDecrease + 10 : intervalDecrease;
    } else {
        difficulty = 4;
        intervalDecrease = 0;
    }
}

function toggleButtonsCursorStyle() {
    for (let element of buttonElements) {
        element.style.cursor = element.style.cursor === 'pointer' ? 'auto' : 'pointer';
    }
}

function updateScore() {
    scoreElement.innerHTML = score;
    highScoreElement.innerHTML = highScore;
}

controlElement.onclick = () => {
    if (canStartRound) {
        callRound();

        canStartRound = false;
    }
};

for (let element of buttonElements) {
    element.onclick = processClick;

    element.onmouseenter = () => {
        if (waitingPlayerAnswer && !element.classList.contains('active')) {
            element.classList.add('hover');
        }
    };

    element.onmouseleave = () => {
        if (waitingPlayerAnswer && !element.classList.contains('active')) {
            element.classList.remove('hover');
        }
    }
}
