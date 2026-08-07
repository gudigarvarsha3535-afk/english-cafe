let score = 0;
let currentQuestion = 0;
let streak = 0;

// ===============================
// ADVENTURE MAP PROGRESS
// ===============================

let level1Completed = false;
let level2Completed = false;

let correctAnswers = 0;
let bestStreak = 0;

let grammarCorrectAnswers = 0;
let grammarBestStreak = 0;
let grammarStreak = 0;

// ===============================
// LEVEL 1 QUESTIONS
// ===============================

const questions = [

    {
        question: "What is the meaning of “Happy”?",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        answer: 1
    },

    {
        question: "What is the opposite of “Brave”?",
        options: ["Fearful", "Strong", "Clever", "Happy"],
        answer: 0
    },

    {
        question: "What does “Quick” mean?",
        options: ["Slow", "Fast", "Quiet", "Weak"],
        answer: 1
    },

    {
        question: "What is the meaning of “Begin”?",
        options: ["Finish", "Start", "Stop", "Sleep"],
        answer: 1
    },

    {
        question: "What is the opposite of “Difficult”?",
        options: ["Hard", "Easy", "Heavy", "Long"],
        answer: 1
    },

    {
        question: "What does “Huge” mean?",
        options: ["Very small", "Very fast", "Very large", "Very weak"],
        answer: 2
    },

    {
        question: "Choose the word closest in meaning to “Smart”.",
        options: ["Clever", "Lazy", "Slow", "Weak"],
        answer: 0
    },

    {
        question: "What is the opposite of “Early”?",
        options: ["Fast", "Late", "Quick", "First"],
        answer: 1
    },

    {
        question: "What does “Quiet” mean?",
        options: ["Making little or no noise", "Very angry", "Very fast", "Very bright"],
        answer: 0
    },

    {
        question: "Choose the correct word: The elephant is very ___.",
        options: ["Tiny", "Huge", "Short", "Weak"],
        answer: 1
    },

    {
        question: "What is the meaning of “Honest”?",
        options: ["Always telling the truth", "Always being late", "Very angry", "Very noisy"],
        answer: 0
    },

    {
        question: "What is the opposite of “Ancient”?",
        options: ["Old", "Modern", "Broken", "Small"],
        answer: 1
    },

    {
        question: "What does “Rapid” mean?",
        options: ["Slow", "Fast", "Quiet", "Weak"],
        answer: 1
    },

    {
        question: "Choose the word closest in meaning to “Beautiful”.",
        options: ["Ugly", "Pretty", "Angry", "Noisy"],
        answer: 1
    },

    {
        question: "Choose the correct word: Please ___ the door.",
        options: ["close", "closed", "closing", "closes"],
        answer: 0
    }

];


// ===============================
// LEVEL 1 - CHECK ANSWER + RETRY
// ===============================

let retryingQuestion = false;

function checkAnswer(selectedAnswer) {

    const feedback = document.getElementById("feedback");
    const buttons = document.querySelectorAll(".biscuit");

    const current = questions[currentQuestion];
    const correctAnswer = current.answer;

    // =========================
    // CORRECT ANSWER
    // =========================

    if (selectedAnswer === correctAnswer) {

        buttons[selectedAnswer].classList.add("correct");

        // First attempt = 10 points
        // Retry = 5 points
        if (retryingQuestion) {

            score += 5;
            correctAnswers++;

            feedback.innerHTML =
                "🌟 You mastered it! +5 points!";

            retryingQuestion = false;

        } else {

            score += 10;
            streak++;
            correctAnswers++;

            if (streak > bestStreak) {
                bestStreak = streak;
            }

            if (streak >= 2) {

                feedback.textContent =
                    `🔥 ${streak} Answer Streak! +10 points!`;

            } else {

                feedback.textContent =
                    "🎉 Correct! +10 points! ☕✨";
            }
        }

        // Disable all buttons
        buttons.forEach(button => {
            button.disabled = true;
        });

        // Update score
        document.getElementById("score").textContent = score;

        document.getElementById("streak").textContent = streak;

        // Move to next question
        setTimeout(() => {

            currentQuestion++;

            if (currentQuestion < questions.length) {

                loadQuestion();

            } else {

                showLevelComplete();

            }

        }, 1200);

    }

    // =========================
    // WRONG ANSWER
    // =========================

    else {

        // Highlight ONLY the wrong answer
        buttons[selectedAnswer].classList.add("wrong");

        // Disable the wrong button
        buttons[selectedAnswer].disabled = true;

        // Do NOT highlight the correct answer
        // Student must figure it out!

        streak = 0;
        retryingQuestion = true;

        feedback.innerHTML = `
            ❌ Not quite!<br><br>

            💡 <strong>Think about it:</strong><br>
            ${getExplanation(currentQuestion)}

            <br><br>

            🔄 <strong>Try again!</strong>
        `;

        // Update streak
        document.getElementById("streak").textContent = streak;
    }
}

// ===============================
// LEVEL 1 - LEARNING HINTS
// ===============================

function getExplanation(questionIndex) {

    const explanations = [

        "Happy describes a feeling of joy or pleasure.",

        "Brave means having courage. Think about the feeling someone has when they are afraid.",

        "Quick describes something that happens or moves in a short amount of time.",

        "Begin means to start something.",

        "Difficult describes something that is not easy.",

        "Huge describes something that has a very big size.",

        "Smart describes someone who is clever and understands things quickly.",

        "Early means happening before the expected time.",

        "Quiet describes a place or person that makes little or no noise.",

        "An elephant is known for being very large in size.",

        "An honest person tells the truth and does not lie.",

        "Ancient describes something from a very long time ago. Think about the opposite of old.",

        "Rapid means happening or moving very quickly.",

        "Beautiful describes something that looks very attractive or pleasing.",

        "When you want someone to shut a door, you tell them to ___ it."

    ];

    return explanations[questionIndex];
}

// ===============================
// LEVEL 1 - LOAD QUESTION
// ===============================

function loadQuestion() {

    const current = questions[currentQuestion];

    // Question number
    document.getElementById("question-number").textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    // Progress
    document.getElementById("progress-fill").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    // Question text
    const questionElement = document.querySelector(".question");

    if (questionElement) {
        questionElement.textContent = current.question;
    }

    // Options
    const buttons = document.querySelectorAll(".biscuit");

    buttons.forEach((button, index) => {

        // 🔥 REMOVE OLD ANSWER COLORS
        button.classList.remove("correct", "wrong");

        // Enable button again
        button.disabled = false;

        // Add new option
        button.innerHTML = `🍪 ${current.options[index]}`;

        // Connect button to new answer
        button.onclick = function () {
            checkAnswer(index);
        };

    });

    // Clear feedback
    document.getElementById("feedback").textContent = "";
}

// ===============================
// LEVEL 1 COMPLETE
// ===============================

function showLevelComplete() {

    level1Completed = true;

    const stars = calculateStars(questions.length);

    document.querySelector(".game-container").innerHTML = `

        <div class="reward-screen">

            <div class="reward-stars">
                ${stars}
            </div>

            <div class="reward-cup">
                🏆
            </div>

            <h1>CAFÉ COMPLETE!</h1>

            <p class="reward-message">
                ☕ Amazing work! You completed Level 1!
            </p>

            <div class="stats-card">

                <div class="stat">
                    <span class="stat-icon">🏆</span>
                    <span class="stat-label">Score</span>
                    <strong>${score}</strong>
                </div>

                <div class="stat">
                    <span class="stat-icon">✅</span>
                    <span class="stat-label">Correct</span>
                    <strong>${correctAnswers}/${questions.length}</strong>
                </div>

                <div class="stat">
                    <span class="stat-icon">🔥</span>
                    <span class="stat-label">Best Streak</span>
                    <strong>${bestStreak}</strong>
                </div>

            </div>

            <button class="level-button" onclick="returnToMap()">
                        🗺️ Back to Adventure Map
            </button>

        </div>

    `;
}


// ===============================
// LEVEL 2 INTRO
// ===============================

function startLevel2() {

    currentGrammarQuestion = 0;

    grammarCorrectAnswers = 0;
    grammarBestStreak = 0;
    grammarStreak = 0;

    document.querySelector(".game-container").innerHTML = `

        <div class="level-two">

            <div class="question-cup">
                🍰
            </div>

            <h1>🔓 Level 2 Unlocked!</h1>

            <h2>📚 Grammar Café</h2>

            <p>Ready to serve some grammar?</p>

            <button class="level-button" onclick="loadLevel2()">
                ☕ Enter Grammar Café
            </button>

        </div>

    `;
}


// ===============================
// LEVEL 2 QUESTIONS
// ===============================

const grammarQuestions = [

    {
        question: "Choose the correct sentence.",
        options: [
            "She go to school every day.",
            "She goes to school every day.",
            "She going to school every day.",
            "She gone to school every day."
        ],
        answer: 1
    },

    {
        question: "Choose the correct sentence.",
        options: [
            "They is playing cricket.",
            "They am playing cricket.",
            "They are playing cricket.",
            "They be playing cricket."
        ],
        answer: 2
    },

    {
        question: "Choose the correct word: He ___ a book every night.",
        options: [
            "read",
            "reads",
            "reading",
            "reader"
        ],
        answer: 1
    },

    {
        question: "Choose the correct sentence.",
        options: [
            "I has a new pencil.",
            "I having a new pencil.",
            "I have a new pencil.",
            "I had have a new pencil."
        ],
        answer: 2
    },

    {
        question: "Choose the correct word: We ___ football yesterday.",
        options: [
            "play",
            "plays",
            "played",
            "playing"
        ],
        answer: 2
    },

    {
        question: "Choose the correct word: She ___ watching TV now.",
        options: [
            "is",
            "are",
            "am",
            "be"
        ],
        answer: 0
    },

    {
        question: "Choose the correct sentence.",
        options: [
            "He don't like coffee.",
            "He doesn't like coffee.",
            "He doesn't likes coffee.",
            "He not like coffee."
        ],
        answer: 1
    },

    {
        question: "Fill in the blank: I ___ my homework before dinner.",
        options: [
            "finish",
            "finished",
            "finishing",
            "finishes"
        ],
        answer: 1
    },

    {
        question: "Choose the correct word: There ___ three books on the table.",
        options: [
            "is",
            "am",
            "are",
            "be"
        ],
        answer: 2
    },

    {
        question: "Choose the correct sentence.",
        options: [
            "She can sings very well.",
            "She can singing very well.",
            "She can sing very well.",
            "She can sang very well."
        ],
        answer: 2
    },

    {
        question: "Fill in the blank: Rahul is taller ___ Amit.",
        options: [
            "then",
            "than",
            "that",
            "to"
        ],
        answer: 1
    },

    {
        question: "Choose the correct sentence.",
        options: [
            "I have never seen that movie.",
            "I never have seen that movie.",
            "I has never seen that movie.",
            "I having never seen that movie."
        ],
        answer: 0
    },

    {
        question: "Fill in the blank: If it rains, we ___ stay at home.",
        options: [
            "will",
            "would",
            "are",
            "have"
        ],
        answer: 0
    },

    {
        question: "Choose the correct sentence.",
        options: [
            "Neither of the answers are correct.",
            "Neither of the answers is correct.",
            "Neither of the answers be correct.",
            "Neither of the answers were correct."
        ],
        answer: 1
    },

    {
        question: "Choose the correct sentence.",
        options: [
            "She has been studying for two hours.",
            "She have been studying for two hours.",
            "She has studying for two hours.",
            "She been studying for two hours."
        ],
        answer: 0
    }

];

let currentGrammarQuestion = 0;
let grammarRetryingQuestion = false;


// ===============================
// LOAD LEVEL 2
// ===============================

function loadLevel2() {

    document.querySelector(".game-container").innerHTML = `

        <div class="top-bar">

            <span>☕ English Café</span>

            <span>
                ⭐ Score:
                <span id="score">${score}</span>
            </span>

            <span>
                🔥 Streak:
                <span id="streak">${streak}</span>
            </span>

        </div>

        <h2>📚 Level 2: Grammar Café</h2>

        <div class="progress-info">

            <span id="grammar-question-number">
                Question 1 / ${grammarQuestions.length}
            </span>

        </div>

        <div class="progress-bar">

            <div id="grammar-progress-fill"></div>

        </div>

        <div class="question-cup">

            <div class="cup">☕</div>

            <div class="question" id="grammar-question">
                ${grammarQuestions[0].question}
            </div>

        </div>

        <div class="options">

            ${grammarQuestions[0].options.map((option, index) => `

                <button
                    class="biscuit"
                    onclick="checkGrammarAnswer(${index})"
                >
                    🍪 ${option}
                </button>

            `).join("")}

        </div>

        <p id="grammar-feedback"></p>

    `;

    updateGrammarProgress();
}


// ===============================
// LEVEL 2 - CHECK ANSWER + RETRY
// ===============================

function checkGrammarAnswer(selectedAnswer) {

    const feedback =
        document.getElementById("grammar-feedback");

    const current =
        grammarQuestions[currentGrammarQuestion];

    const buttons =
        document.querySelectorAll(".biscuit");

    const correctAnswer = current.answer;

    // =========================
    // CORRECT ANSWER
    // =========================

    if (selectedAnswer === correctAnswer) {

        buttons[selectedAnswer].classList.add("correct");

        // First attempt = 10 points
        // Retry = 5 points
        if (grammarRetryingQuestion) {

            score += 5;
            grammarCorrectAnswers++;

            feedback.innerHTML =
                "🌟 Grammar mastered! +5 points!";

            grammarRetryingQuestion = false;

        } else {

            score += 10;
            grammarCorrectAnswers++;
            grammarStreak++;

            if (grammarStreak > grammarBestStreak) {
                grammarBestStreak = grammarStreak;
            }

            if (grammarStreak >= 2) {

                feedback.textContent =
                    `🔥 ${grammarStreak} Grammar Streak! +10 points!`;

            } else {

                feedback.textContent =
                    "🎉 Correct! +10 points! 📚✨";
            }
        }

        // Disable all buttons
        buttons.forEach(button => {
            button.disabled = true;
        });

        // Update score
        document.getElementById("score").textContent =
            score;

        // Move to next question
        setTimeout(() => {

            currentGrammarQuestion++;

            if (
                currentGrammarQuestion <
                grammarQuestions.length
            ) {

                loadGrammarQuestion();

            } else {

                showGrammarComplete();

            }

        }, 1200);

    }

    // =========================
    // WRONG ANSWER
    // =========================

    else {

        // Highlight ONLY the wrong answer
        buttons[selectedAnswer].classList.add("wrong");

        // Disable the wrong answer
        buttons[selectedAnswer].disabled = true;

        // DO NOT reveal correct answer
        grammarRetryingQuestion = true;

        grammarStreak = 0;

        feedback.innerHTML = `
            ❌ Not quite!<br><br>

            💡 <strong>Think about it:</strong><br>
            ${getGrammarHint(currentGrammarQuestion)}

            <br><br>

            🔄 <strong>Try again!</strong>
        `;

        // Update streak
        const streakElement =
            document.getElementById("streak");

        if (streakElement) {
            streakElement.textContent =
                grammarStreak;
        }
    }
}

// ===============================
// LEVEL 2 - GRAMMAR HINTS
// ===============================

function getGrammarHint(questionIndex) {

    const hints = [

        "For 'she', use the verb form that agrees with one person.",
        
        "Think about the correct form of 'be' used with 'they'.",
        
        "With 'he' in the simple present, the verb usually takes an 's'.",
        
        "The subject 'I' uses the base form 'have'.",
        
        "The word 'yesterday' tells us the action happened in the past.",
        
        "The word 'now' tells us the action is happening at this moment.",
        
        "With 'he' in a negative sentence, use 'doesn't' before the base verb.",
        
        "The word 'before' tells us about an action that happened in the past.",
        
        "The subject 'three books' is plural, so think about the plural form of 'be'.",
        
        "After 'can', use the base form of the verb.",
        
        "When comparing two people or things, use the word used in comparisons.",
        
        "The phrase 'have never' is commonly used to talk about an experience up to now.",
        
        "In a possible future situation, think about the word used for the future result.",
        
        "With 'neither', the verb is normally singular.",
        
        "For an action that started in the past and is still continuing, use the present perfect continuous form."
    ];

    return hints[questionIndex];
}


// ===============================
// LEVEL 2 - LOAD NEXT QUESTION
// ===============================

function loadGrammarQuestion() {

    const current =
        grammarQuestions[currentGrammarQuestion];

    // Question number
    document.getElementById(
        "grammar-question-number"
    ).textContent =
        `Question ${currentGrammarQuestion + 1} / ${grammarQuestions.length}`;

    // Question text
    document.getElementById(
        "grammar-question"
    ).textContent =
        current.question;

    // Options
    const buttons =
        document.querySelectorAll(".biscuit");

    buttons.forEach((button, index) => {

        // 🔥 REMOVE OLD ANSWER COLORS
        button.classList.remove("correct", "wrong");

        // Enable button again
        button.disabled = false;

        // Load new option
        button.innerHTML =
            `🍪 ${current.options[index]}`;

        // Connect button to new answer
        button.onclick = function () {
            checkGrammarAnswer(index);
        };

    });

    // Clear feedback
    document.getElementById(
        "grammar-feedback"
    ).textContent = "";

    // Update progress
    updateGrammarProgress();
}

// ===============================
// LEVEL 2 PROGRESS
// ===============================

function updateGrammarProgress() {

    const progress =
        ((currentGrammarQuestion + 1) /
        grammarQuestions.length) * 100;

    document.getElementById(
        "grammar-progress-fill"
    ).style.width = `${progress}%`;
}


// ===============================
// LEVEL 2 COMPLETE
// ===============================

function showGrammarComplete() {

    level2Completed = true;

    const stars =
        calculateStarsForLevel(
            grammarCorrectAnswers,
            grammarQuestions.length
        );

    document.querySelector(".game-container").innerHTML = `

        <div class="reward-screen">

            <div class="reward-stars">
                ${stars}
            </div>

            <div class="reward-cup">
                🏆
            </div>

            <h1>GRAMMAR CAFÉ COMPLETE!</h1>

            <p class="reward-message">
                📚 Fantastic! You completed Level 2!
            </p>

            <div class="stats-card">

                <div class="stat">
                    <span class="stat-icon">🏆</span>
                    <span class="stat-label">Total Score</span>
                    <strong>${score}</strong>
                </div>

                <div class="stat">
                    <span class="stat-icon">✅</span>
                    <span class="stat-label">Correct</span>
                    <strong>
                        ${grammarCorrectAnswers}/${grammarQuestions.length}
                    </strong>
                </div>

                <div class="stat">
                    <span class="stat-icon">🔥</span>
                    <span class="stat-label">Best Streak</span>
                    <strong>${grammarBestStreak}</strong>
                </div>

            </div>

            <div class="next-level-card">

                <div class="next-level-icon">💬</div>

                <h2>Level 3</h2>

                <p>Conversation Café</p>

                <span>🔒 Coming Soon</span>

            </div>

        </div>

    `;
}

// ===============================
// 🗺️ BEAUTIFUL ADVENTURE MAP
// ===============================

function showAdventureMap() {

    document.querySelector(".game-container").innerHTML = `

        <div class="adventure-map">

            <!-- MAP TITLE -->

            <div class="map-title">
                <h1>☕ English Café</h1>
                <p>✨ Your English Adventure ✨</p>
            </div>


            <!-- DECORATION -->

            <div class="map-cloud cloud-one">☁️</div>
            <div class="map-cloud cloud-two">☁️</div>
            <div class="map-cloud cloud-three">☁️</div>
            <div class="map-cloud cloud-four">☁️</div>

            <div class="map-sparkle sparkle-one">✨</div>
            <div class="map-sparkle sparkle-two">⭐</div>


            <!-- PATH -->

            <div class="adventure-path">

                <div class="path-dot dot-one"></div>
                <div class="path-dot dot-two"></div>
                <div class="path-dot dot-three"></div>

            </div>


            <!-- LEVEL 1 -->

            <button
                class="level-bubble level-one ${
                    level1Completed ? "completed" : "unlocked"
                }"
                onclick="openLevelPopup(1)"
            >

                <span class="bubble-icon">🍰</span>

                <span class="bubble-number">
                    1
                </span>

            </button>


            <!-- LEVEL 2 -->

            <button
                class="level-bubble level-two ${
                    level1Completed ? "unlocked" : "locked"
                }"
                onclick="${
                    level1Completed
                        ? "openLevelPopup(2)"
                        : "showLockedMessage()"
                }"
            >

                <span class="bubble-icon">📚</span>

                <span class="bubble-number">
                    2
                </span>

            </button>


            <!-- LEVEL 3 -->

            <button
                class="level-bubble level-three locked"
                onclick="showLockedMessage()"
            >

                <span class="bubble-icon">💬</span>

                <span class="bubble-number">
                    3
                </span>

                <span class="lock-icon">
                    🔒
                </span>

            </button>


            <!-- MILKSY -->

            <div class="milksy-container">

                <div class="milksy-character">

                    <img
                        src="imgaes/milksy/milksy.png"
                        alt="Milksy"
                        class="milksy"
                    >

                    <div class="milksy-expression">😊</div>

                </div>

                <div class="milksy-speech">

                    <strong>Hi! I'm Milksy! 🥛</strong>

                    <br>

                    Ready for an adventure?

                </div>

            </div>


            <!-- MAP FOOTER -->

            <div class="map-stats">

                ⭐ Score:
                <strong>${score}</strong>

                &nbsp;&nbsp; | &nbsp;&nbsp;

                🏆 Completed:
                <strong>
                    ${level1Completed + level2Completed}/2
                </strong>

            </div>


            <!-- LEVEL POPUP -->

            <div
                id="level-popup"
                class="level-popup hidden"
            >

                <div class="popup-card">

                    <button
                        class="popup-close"
                        onclick="closeLevelPopup()"
                    >
                        ✕
                    </button>

                    <div
                        id="popup-icon"
                        class="popup-icon"
                    >
                    </div>

                    <h2 id="popup-title"></h2>

                    <p id="popup-description"></p>

                    <button
                        id="popup-enter"
                        class="popup-enter"
                    >
                        ☕ Enter Café
                    </button>

                </div>

            </div>

        </div>

    `;
}

// ===============================
// 🫧 LEVEL POPUP
// ===============================

function openLevelPopup(level) {

    const popup =
        document.getElementById("level-popup");

    const icon =
        document.getElementById("popup-icon");

    const title =
        document.getElementById("popup-title");

    const description =
        document.getElementById("popup-description");

    const enterButton =
        document.getElementById("popup-enter");


    if (level === 1) {

        icon.textContent = "🍰";

        title.textContent =
            "Level 1: Vocabulary Café";

        description.textContent =
            "Learn new words, discover their meanings and build your vocabulary!";

        enterButton.onclick = function () {
            closeLevelPopup();
            startLevel1();
        };

    }


    if (level === 2) {

        icon.textContent = "📚";

        title.textContent =
            "Level 2: Grammar Café";

        description.textContent =
            "Master grammar through fun challenges and become a Grammar Café expert!";

        enterButton.onclick = function () {
            closeLevelPopup();
            startLevel2();
        };

    }


    popup.classList.remove("hidden");

}

// ===============================
// CLOSE POPUP
// ===============================

function closeLevelPopup() {

    const popup =
        document.getElementById("level-popup");

    popup.classList.add("hidden");

}


// ===============================
// LOCKED LEVEL MESSAGE
// ===============================

function showLockedMessage() {

    const feedback =
        document.createElement("div");

    feedback.className =
        "locked-message";

    feedback.innerHTML =
        "🔒 Complete the previous café to unlock this adventure!";

    document.querySelector(".adventure-map")
        .appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 2500);

}

// ===============================
// RETURN TO ADVENTURE MAP
// ===============================

function returnToMap() {

    showAdventureMap();

}

// ===============================
// START LEVEL 1
// ===============================

function startLevel1() {

    currentQuestion = 0;

    streak = 0;

    correctAnswers = 0;

    retryingQuestion = false;

    document.querySelector(".game-container").innerHTML = `

        <div class="top-bar">

            <span>☕ English Café</span>

            <span>
                ⭐ Score:
                <span id="score">${score}</span>
            </span>

            <span>
                🔥 Streak:
                <span id="streak">${streak}</span>
            </span>

        </div>

        <h2>🍰 Level 1: Vocabulary</h2>

        <div class="progress-info">
            <span id="question-number">
                Question 1 / ${questions.length}
            </span>
        </div>

        <div class="progress-bar">
            <div id="progress-fill"></div>
        </div>

        <div class="question-cup">

            <div class="cup">🍵</div>

            <div class="question"></div>

        </div>

        <div class="options">

            <button class="biscuit"></button>
            <button class="biscuit"></button>
            <button class="biscuit"></button>
            <button class="biscuit"></button>

        </div>

        <p id="feedback"></p>

    `;

    loadQuestion();
}

// ===============================
// START GAME
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    showAdventureMap();

    setTimeout(() => {

        startMilksyAdventure();

    }, 1000);
});

function calculateStars(totalQuestions) {

    const percentage =
        (correctAnswers / totalQuestions) * 100;

    if (percentage === 100) {
        return "⭐⭐⭐";
    }

    if (percentage >= 75) {
        return "⭐⭐";
    }

    if (percentage >= 50) {
        return "⭐";
    }

    return "🌱";
}

function calculateStarsForLevel(correct, total) {

    const percentage =
        (correct / total) * 100;

    if (percentage === 100) {
        return "⭐⭐⭐";
    }

    if (percentage >= 75) {
        return "⭐⭐";
    }

    if (percentage >= 50) {
        return "⭐";
    }

    return "🌱";
}

// =========================================
// 👆🥛 SMOOTH MILKSY DRAG SYSTEM
// =========================================

let draggingMilksy = false;

let dragOffsetX = 0;
let dragOffsetY = 0;


// =========================================
// 🖱️ START DRAG
// =========================================

function startMilksyDrag(event) {

    const milksy =
        event.target.closest(".milksy");

    if (!milksy) return;

    const container =
        milksy.closest(".milksy-container");

    const map =
        milksy.closest(".adventure-map");

    if (!container || !map) return;

    draggingMilksy = true;

    // Stop floating animation while dragging
    container.classList.add("dragging");

    const containerRect =
        container.getBoundingClientRect();

    dragOffsetX =
        event.clientX - containerRect.left;

    dragOffsetY =
        event.clientY - containerRect.top;

    // Capture the pointer
    if (event.pointerId !== undefined) {
        milksy.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
}


// =========================================
// 🥛 DRAG MILKSY
// =========================================

function dragMilksy(event) {

    if (!draggingMilksy) return;

    const container =
        document.querySelector(".milksy-container");

    const map =
        document.querySelector(".adventure-map");

    if (!container || !map) return;

    const mapRect =
        map.getBoundingClientRect();

    let newX =
        event.clientX -
        mapRect.left -
        dragOffsetX;

    let newY =
        event.clientY -
        mapRect.top -
        dragOffsetY;


    // =====================================
    // KEEP MILKSY INSIDE THE MAP
    // =====================================

    const maxX =
        mapRect.width -
        container.offsetWidth;

    const maxY =
        mapRect.height -
        container.offsetHeight;


    newX =
        Math.max(
            0,
            Math.min(newX, maxX)
        );

    newY =
        Math.max(
            0,
            Math.min(newY, maxY)
        );


    // =====================================
    // MOVE MILKSY
    // =====================================

    container.style.left =
        newX + "px";

    container.style.top =
        newY + "px";

    container.style.bottom =
        "auto";

    event.preventDefault();
}


// =========================================
// ✋ RELEASE MILKSY
// =========================================

function stopMilksyDrag(event) {

    if (!draggingMilksy) return;

    draggingMilksy = false;

    const milksy =
        document.querySelector(".milksy");

    if (milksy) {
        
        const container =
            milksy.closest(".milksy-container");

        if (container) {
            container.classList.remove("dragging");
        }
    }
}


// =========================================
// 🎮 POINTER EVENTS
// Works with mouse + touchscreen + pen
// =========================================

document.addEventListener(
    "pointerdown",
    startMilksyDrag
);

document.addEventListener(
    "pointermove",
    dragMilksy
);

document.addEventListener(
    "pointerup",
    stopMilksyDrag
);

document.addEventListener(
    "pointercancel",
    stopMilksyDrag
);

// =========================================
// 🥛 MILKSY EXPRESSIONS
// =========================================

function setMilksyExpression(expression, mood = "happy") {

    const container =
        document.querySelector(".milksy-container");

    const face =
        document.querySelector(".milksy-expression");

    if (!container || !face) return;

    face.textContent = expression;

    container.classList.remove(
        "happy",
        "excited",
        "thinking",
        "proud",
        "encouraging",
        "celebrating",
        "waving"
    );

    container.classList.add(mood);
}

// =========================================
// 🥛 MILKSY WALK
// =========================================

let milksyWalking = false;
let milksyWalkTimer = null;

function startMilksyWalking(direction = "right") {

    const container =
        document.querySelector(".milksy-container");

    if (!container) return;

    container.classList.remove(
        "walking-left",
        "walking-right"
    );

    container.classList.add("walking");

    if (direction === "left") {
        container.classList.add("walking-left");
    } else {
        container.classList.add("walking-right");
    }

    milksyWalking = true;
}


function stopMilksyWalking() {

    const container =
        document.querySelector(".milksy-container");

    if (!container) return;

    container.classList.remove(
        "walking",
        "walking-left",
        "walking-right"
    );

    milksyWalking = false;
}

// =========================================
// 🥛 MILKSY REAL MOVEMENT SYSTEM
// =========================================

let milksyMoving = false;
let milksyTimer = null;

function startMilksyAdventure() {

    const milksy =
        document.querySelector(".milksy-container");

    const map =
        document.querySelector(".adventure-map");

    if (!milksy || !map) return;

    // Starting position
    let x = milksy.offsetLeft;
    let y = milksy.offsetTop;

    let targetX = x;
    let targetY = y;

    let direction = 1;

    milksyMoving = true;

    function chooseDestination() {

        targetX =
            30 +
            Math.random() *
            (map.clientWidth -
                milksy.offsetWidth -
                60);

        targetY =
            100 +
            Math.random() *
            (map.clientHeight -
                milksy.offsetHeight -
                180);

        if (targetX > x) {
            direction = 1;
        } else {
            direction = -1;
        }

        milksy.classList.add("walking");

        if (direction === 1) {

            milksy.classList.remove("walking-left");
            milksy.classList.add("walking-right");

        } else {

            milksy.classList.remove("walking-right");
            milksy.classList.add("walking-left");

        }
    }

    chooseDestination();

    function move() {

        if (!milksyMoving) return;

        // Don't move while the player is dragging Milksy
        if (draggingMilksy) {
            requestAnimationFrame(move);
            return;
        }

        const dx = targetX - x;
        const dy = targetY - y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        // Reached destination
        if (distance < 4) {

            milksy.classList.remove("walking");

            clearTimeout(milksyTimer);

            milksyTimer = setTimeout(() => {

                chooseDestination();

            }, 1200);

            requestAnimationFrame(move);

            return;
        }

        // Movement speed
        const speed = 2;

        x += (dx / distance) * speed;
        y += (dy / distance) * speed;

        // Apply position
        milksy.style.left = x + "px";
        milksy.style.top = y + "px";
        milksy.style.bottom = "auto";

        requestAnimationFrame(move);
    }

    move();
}

function startLevel1() {

    const gameContainer = document.querySelector(".game-container");

    gameContainer.innerHTML = `

        <div class="level1-game">

            <div class="top-bar">

                <div class="logo">
                    ☕ Milksy English Adventure
                </div>

                <div class="game-stats">

                    <div class="stat-box">
                        ⭐ <span id="score">0</span>
                    </div>

                    <div class="stat-box">
                        🔥 <span id="streak">0</span>
                    </div>

                    <div class="stat-box">
                        🏆 <span id="stars">0</span>
                    </div>

                </div>

            </div>

            <div class="level-title">

                <h1>🌸 Level 1</h1>

                <h2>Scratch & Match</h2>

                <p>
                    Scratch a card, discover the word,
                    then match it with the correct picture!
                </p>

            </div>

            <div class="parts">

                <button class="part active">
                    Part 1<br>Nouns
                </button>

                <button class="part locked">
                    Part 2<br>Pronouns
                </button>

                <button class="part locked">
                    Part 3<br>Verbs
                </button>

                <button class="part locked">
                    Part 4<br>Adjectives
                </button>

                <button class="part locked">
                    Part 5<br>Adverbs
                </button>

                <button class="part locked">
                    Part 6<br>Prepositions
                </button>

                <button class="part locked">
                    Part 7<br>Conjunctions
                </button>

            </div>

            <div class="progress-section">

                <div class="progress-text">

                    Progress

                    <span id="progressText">
                        0 / 9 Matched
                    </span>

                </div>

                <div class="progress-bar">

                    <div id="progress-fill"></div>

                </div>

            </div>

            <section class="scratch-game">

                <div class="left-panel">

                    <h2 class="panel-title">
                        🎴 Scratch Cards
                    </h2>

                    <p class="panel-description">
                        Scratch a card to reveal a hidden noun.
                    </p>

                    <div
                        id="scratchGrid"
                        class="scratch-grid">
                    </div>

                </div>

                <div class="right-panel">

                    <h2 class="panel-title">
                        🖼️ Match the Picture
                    </h2>

                    <p class="panel-description">
                        Drag the revealed word onto its picture.
                    </p>

                    <div
                        id="imageGrid"
                        class="image-grid">
                    </div>

                </div>

            </section>

            <div class="milksy-helper">

                <div class="milksy-avatar">
                    🥛
                </div>

                <div
                    id="milksyMessage"
                    class="speech">

                    Hello! Scratch a card to begin!

                </div>

            </div>

            <div class="bottom-bar">

                <div class="bottom-item">
                    ⭐ Stars
                    <span id="starCount">0</span>
                </div>

                <div class="bottom-item">
                    🎯 Matches
                    <span id="matchCount">0</span>
                </div>

                <div class="bottom-item">
                    🔥 Best Streak
                    <span id="bestStreak">0</span>
                </div>

            </div>

            <div
                id="levelCompletePopup"
                class="popup hidden">

                <div class="popup-card">

                    <h1>🎉 Fantastic!</h1>

                    <p>
                        You completed Part 1!
                    </p>

                    <div class="reward-stars">
                        ⭐ ⭐ ⭐
                    </div>

                    <button
                        id="nextPartBtn"
                        class="next-btn">

                        Next Part →

                    </button>

                </div>

            </div>

        </div>

    `;

    // Start Scratch & Match
    createScratchCards();
    createImages();
    updateScore();

}
