// --- DOM Element References ---
const utteranceDisplay = document.getElementById('utterance-display');
const approveBtn = document.getElementById('approve-btn');
const rejectBtn = document.getElementById('reject-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const feedbackMessage = document.getElementById('feedback-message');
const fuelLevel = document.getElementById('fuel-level');
const fuelPercentage = document.getElementById('fuel-percentage');
const rocketBody = document.getElementById('rocket-body');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const finalFuelDisplay = document.getElementById('final-fuel');
const launchMessageDisplay = document.getElementById('launch-message');
const gameArea = document.getElementById('game-area'); // To hide/show controls

// --- Game Data ---
// (Examples from slides 8, 10, 11, 13, 16)
const allUtterances = [
    { text: "Presset mot Trump øker.", isSentence: true, reason: "" },
    { text: "KrF kutter kutt.", isSentence: true, reason: "" },
    { text: "Olje-nei et demokratisk problem.", isSentence: false, reason: "Mangler finitt verbal" },
    { text: "Kommer snart.", isSentence: false, reason: "Mangler subjekt" },
    { text: "Blir ikke lenge.", isSentence: false, reason: "Mangler subjekt" },
    { text: "Selskap siktet for grov kriminalitet.", isSentence: false, reason: "Mangler finitt verbal" },
    { text: "Ja.", isSentence: false, reason: "Mangler subjekt og finitt verbal (Setningsekvivalent)" },
    { text: "Pokker!", isSentence: false, reason: "Setningsekvivalent" },
    { text: "Knusende dom over norsk hvitvaskingsbekjempelse.", isSentence: false, reason: "Mangler finitt verbal" },
    { text: "Selger bolig på Instagram.", isSentence: false, reason: "Mangler subjekt (implisert 'noen')" },
    { text: "Løp!", isSentence: true, reason: "Imperativ er unntak" }, // Imperativ counts as sentence
    { text: "Juryordningen slik vi kjenner den i dag, har utspilt sin rolle.", isSentence: true, reason: "" },
    { text: "Stoltenberg med hard Russland-kritikk.", isSentence: false, reason: "Mangler finitt verbal" },
    { text: "Bekreftet Stoltenberg at han er kandidat til NATO-jobben?", isSentence: true, reason: "" }, // Spørresetning
    { text: "Greit.", isSentence: false, reason: "Setningsekvivalent" },
    { text: "Huset var ødelagt.", isSentence: true, reason: "" },
    { text: "De svarte kattene løper over veien.", isSentence: true, reason: "" },
    { text: "Vi så den vesle jenta.", isSentence: true, reason: "" }, // Added example
    { text: "Hun er den vesle jenta.", isSentence: true, reason: "" }, // Added example
];

// --- Game State Variables ---
let currentScore = 0;
let currentFuel = 0;
let currentUtterance = null;
let shuffledUtterances = [];
let currentIndex = 0;
let buttonsEnabled = false;

// --- Game Functions ---

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function updateUI() {
    scoreDisplay.textContent = currentScore;
    fuelPercentage.textContent = Math.round(currentFuel);
    fuelLevel.style.width = `${currentFuel}%`;
}

function displayNextUtterance() {
    feedbackMessage.textContent = ''; // Clear previous feedback
    feedbackMessage.className = '';

    if (currentIndex >= shuffledUtterances.length) {
        endGame();
        return;
    }

    currentUtterance = shuffledUtterances[currentIndex];
    utteranceDisplay.textContent = currentUtterance.text;
    currentIndex++;
    buttonsEnabled = true; // Enable buttons for the new utterance
    approveBtn.disabled = false;
    rejectBtn.disabled = false;
}

function checkAnswer(playerChoiceIsSentence) {
    if (!buttonsEnabled || !currentUtterance) return; // Prevent multiple clicks or clicking before start

    buttonsEnabled = false; // Disable buttons immediately after choice
    approveBtn.disabled = true;
    rejectBtn.disabled = true;

    const correctAnswer = currentUtterance.isSentence;
    let isCorrect = (playerChoiceIsSentence === correctAnswer);

    if (isCorrect) {
        currentScore += 10; // Points for correct answer
        currentFuel = Math.min(100, currentFuel + (100 / allUtterances.length)); // Increase fuel proportionally
        feedbackMessage.textContent = "Riktig!";
        feedbackMessage.className = 'correct';
        rocketBody.style.transform = 'translateY(-5px)'; // Small jump for correct
    } else {
        // Optional: Deduct points for wrong answer
        // currentScore -= 5;
        feedbackMessage.textContent = `Feil! Dette var ${correctAnswer ? 'en setning' : 'et fragment'}. ${currentUtterance.reason ? '('+currentUtterance.reason+')' : ''}`;
        feedbackMessage.className = 'incorrect';
         rocketBody.style.transform = 'translateX(5px) rotate(2deg)'; // Small shake for incorrect
    }

    updateUI();

    // Reset rocket position slightly after animation
    setTimeout(() => {
         rocketBody.style.transform = 'translateY(0) translateX(0) rotate(0deg)';
    }, 300);


    // Wait a moment before showing the next utterance
    setTimeout(displayNextUtterance, 1500);
}

function startGame() {
    // Reset state
    currentScore = 0;
    currentFuel = 0;
    currentIndex = 0;
    shuffledUtterances = shuffleArray([...allUtterances]); // Shuffle a copy
    currentUtterance = null;
    buttonsEnabled = false;

    // Reset UI
    updateUI();
    feedbackMessage.textContent = '';
    feedbackMessage.className = '';
    utteranceDisplay.textContent = "Klar..."; // Initial message
    rocketBody.style.transform = 'translateY(0)'; // Reset rocket position

    // Hide game over, show game area
    gameOverScreen.style.display = 'none';
    gameArea.style.display = 'flex'; // Make sure it's visible
    startBtn.style.display = 'none'; // Hide start button during game

    // Start the first question after a brief pause
    setTimeout(displayNextUtterance, 1000);
}

function endGame() {
    buttonsEnabled = false;
    approveBtn.disabled = true;
    rejectBtn.disabled = true;
    gameArea.style.display = 'none'; // Hide game area

    finalScoreDisplay.textContent = currentScore;
    const roundedFuel = Math.round(currentFuel);
    finalFuelDisplay.textContent = roundedFuel;

    // Determine launch message
    let launchMsg = "";
    if (roundedFuel >= 95) {
        launchMsg = "Perfekt! Raketten skytes opp til stjernene! ✨";
        rocketBody.style.transform = 'translateY(-200px)'; // Launch animation
    } else if (roundedFuel >= 70) {
        launchMsg = "Bra jobba! Raketten når bane rundt jorda! 🌍";
         rocketBody.style.transform = 'translateY(-100px)';
    } else if (roundedFuel >= 40) {
        launchMsg = "Tja, den lettet såvidt fra bakken. Bedre lykke neste gang! ☁️";
         rocketBody.style.transform = 'translateY(-30px) rotate(5deg)';
    } else {
        launchMsg = "Å nei! Ikke nok drivstoff til å lette engang... 💥 Prøv igjen!";
         rocketBody.style.transform = 'translateY(10px) rotate(-5deg)'; // Dud launch
    }
    launchMessageDisplay.textContent = launchMsg;

    gameOverScreen.style.display = 'block'; // Show game over screen
}


// --- Event Listeners ---
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

approveBtn.addEventListener('click', () => checkAnswer(true));
rejectBtn.addEventListener('click', () => checkAnswer(false));

// --- Initial Setup ---
// (Game starts when 'Start' button is clicked)