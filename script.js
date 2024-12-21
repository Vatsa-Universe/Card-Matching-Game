const cardsArray = [
    '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉', '🍓', '🍓', 
    '🍒', '🍒', '🍍', '🍍', '🥝', '🥝', '🥭', '🥭'
    // Reduced to 16 pairs of cards instead of 25 pairs
];

// Everything else in JavaScript remains the same.

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let timerInterval = null;
let timeLeft = 45;

document.getElementById('restart-game-button').addEventListener('click', restartGame);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    const selectedCards = cardsArray.slice(0, 25);
    shuffle(selectedCards);
    selectedCards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
    startTimer();
}

function flipCard() {
    if (lockBoard || this === firstCard) return;
    this.innerText = this.dataset.emoji;
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchesFound += 2;
    checkGameOver();
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.innerText = '';
        secondCard.innerText = '';
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function checkGameOver() {
    if (matchesFound === 25) {
        endGame(true);
    }
}

function startTimer() {
    timeLeft = 45;
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    clearInterval(timerInterval);
    document.getElementById('game-over-message').innerText = won ? 'Congratulations!' : 'Time is up!';
    document.getElementById('game-over').classList.remove('hidden');
}

function restartGame() {
    matchesFound = 0;
    document.getElementById('game-over').classList.add('hidden');
    clearInterval(timerInterval);
    createBoard();
}

// Start the game immediately when the page loads
window.addEventListener('load', createBoard);