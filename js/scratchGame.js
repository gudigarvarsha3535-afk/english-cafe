/* ===========================================
   SCRATCH & MATCH ENGINE
=========================================== */

let score = 0;
let streak = 0;
let stars = 0;
let matches = 0;
let bestStreak = 0;

let draggedWord = "";
let matchedWords = new Set();

const nouns = [

    {
        word: "Apple",
        image: "images/nouns/apple.png"
    },

    {
        word: "Dog",
        image: "images/nouns/dog.png"
    },

    {
        word: "Book",
        image: "images/nouns/book.png"
    },

    {
        word: "School",
        image: "images/nouns/school.png"
    },

    {
        word: "Tree",
        image: "images/nouns/tree.png"
    },

    {
        word: "Bus",
        image: "images/nouns/bus.png"
    },

    {
        word: "Chair",
        image: "images/nouns/chair.png"
    },

    {
        word: "Teacher",
        image: "images/nouns/teacher.png"
    },

    {
        word: "Cat",
        image: "images/nouns/cat.png"
    }

];


/* ===========================================
   CREATE SCRATCH CARDS
=========================================== */

function createScratchCards() {

    const grid = document.getElementById("scratchGrid");

    if (!grid) return;

    grid.innerHTML = "";

    nouns.forEach((item) => {

        const card = document.createElement("div");

        card.className = "scratch-card";

        card.dataset.word = item.word;

        card.draggable = false;

        card.innerHTML = "✨";

        card.addEventListener("click", () => {

            revealCard(card, item);

        });

        grid.appendChild(card);

    });

}


/* ===========================================
   REVEAL SCRATCH CARD
=========================================== */

function revealCard(card, item) {

    if (card.classList.contains("revealed")) {
        return;
    }

    if (matchedWords.has(item.word)) {
        return;
    }

    card.classList.add("revealed");

    card.innerHTML = `
        <span class="revealed-word">
            ${item.word}
        </span>
    `;

    card.draggable = true;

    card.addEventListener("dragstart", dragStart);

    safeSound("scratchSound");

    updateMilksyMessage(
        `✨ You found "${item.word}"! Drag it to the correct picture!`
    );

}


/* ===========================================
   DRAG START
=========================================== */

function dragStart(event) {

    draggedWord = event.currentTarget.dataset.word;

    event.dataTransfer.setData(
        "text/plain",
        draggedWord
    );

    event.dataTransfer.effectAllowed = "move";

}


/* ===========================================
   CREATE PICTURE CARDS
=========================================== */

function createImages() {

    const grid = document.getElementById("imageGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const shuffled = [...nouns]
        .sort(() => Math.random() - 0.5);


    shuffled.forEach((item) => {

        const card = document.createElement("div");

        card.className = "picture-card";

        card.dataset.word = item.word;

        card.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.word}"
            >
        `;


        card.addEventListener(
            "dragover",
            allowDrop
        );


        card.addEventListener(
            "drop",
            dropWord
        );


        grid.appendChild(card);

    });

}


/* ===========================================
   ALLOW DROP
=========================================== */

function allowDrop(event) {

    event.preventDefault();

}


/* ===========================================
   DROP WORD
=========================================== */

function dropWord(event) {

    event.preventDefault();

    const picture = event.currentTarget;

    const correctWord = picture.dataset.word;


    /* No word currently being dragged */

    if (!draggedWord) {
        return;
    }


    /* Already matched */

    if (picture.classList.contains("correct")) {
        return;
    }


    /* ========================================
       CORRECT ANSWER
    ======================================== */

    if (draggedWord === correctWord) {

        picture.classList.add("correct");

        matchedWords.add(draggedWord);

        matches++;

        score += 10;

        streak++;

        stars++;


        if (streak > bestStreak) {

            bestStreak = streak;

        }


        /* Find and complete the scratch card */

        const scratchCard =
            document.querySelector(
                `.scratch-card[data-word="${draggedWord}"]`
            );


        if (scratchCard) {

            scratchCard.classList.add("matched");

            scratchCard.draggable = false;

            scratchCard.innerHTML = `
                <span class="matched-word">
                    ✓ ${draggedWord}
                </span>
            `;

        }


        safeSound("correctSound");


        updateMilksyMessage(
            `🎉 Great job! "${draggedWord}" is correct!`
        );


        draggedWord = "";


        updateScore();

        checkCompletion();

    }


    /* ========================================
       WRONG ANSWER
    ======================================== */

    else {

        picture.classList.add("wrong");

        streak = 0;

        safeSound("wrongSound");


        updateMilksyMessage(
            "💭 Almost! Try another picture."
        );


        updateScore();


        setTimeout(() => {

            picture.classList.remove("wrong");

        }, 600);

    }

}


/* ===========================================
   UPDATE SCORE
=========================================== */

function updateScore() {

    const scoreElement =
        document.getElementById("score");

    const streakElement =
        document.getElementById("streak");

    const starsElement =
        document.getElementById("stars");

    const matchElement =
        document.getElementById("matchCount");

    const starCountElement =
        document.getElementById("starCount");

    const bestStreakElement =
        document.getElementById("bestStreak");

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progress-fill");


    if (scoreElement) {

        scoreElement.textContent = score;

    }


    if (streakElement) {

        streakElement.textContent = streak;

    }


    if (starsElement) {

        starsElement.textContent = stars;

    }


    if (matchElement) {

        matchElement.textContent = matches;

    }


    if (starCountElement) {

        starCountElement.textContent = stars;

    }


    if (bestStreakElement) {

        bestStreakElement.textContent = bestStreak;

    }


    if (progressText) {

        progressText.textContent =
            `${matches} / ${nouns.length} Matched`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${(matches / nouns.length) * 100}%`;

    }

}


/* ===========================================
   CHECK COMPLETION
=========================================== */

function checkCompletion() {

    if (matches < nouns.length) {

        return;

    }


    updateMilksyMessage(
        "🏆 Amazing! You matched all the words!"
    );


    const popup =
        document.getElementById(
            "levelCompletePopup"
        );


    if (popup) {

        popup.classList.remove("hidden");

    }


    safeSound("completeSound");

}


/* ===========================================
   MILKSY MESSAGE
=========================================== */

function updateMilksyMessage(message) {

    const messageBox =
        document.getElementById("milksyMessage");


    if (!messageBox) {

        return;

    }


    messageBox.textContent = message;

}


/* ===========================================
   SAFE SOUND
=========================================== */

function safeSound(id) {

    const sound =
        document.getElementById(id);


    if (!sound) {

        return;

    }


    try {

        sound.currentTime = 0;

        sound.play().catch(() => {});

    }

    catch (error) {

        console.log(
            "Sound unavailable:",
            id
        );

    }

}


/* ===========================================
   START GAME
=========================================== */

function startScratchGame() {

    score = 0;

    streak = 0;

    stars = 0;

    matches = 0;

    bestStreak = 0;

    draggedWord = "";

    matchedWords.clear();


    createScratchCards();

    createImages();

    updateScore();


    updateMilksyMessage(
        "Hello! Scratch a card to begin! 🥛✨"
    );

}


/* ===========================================
   START WHEN PAGE LOADS
=========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startScratchGame();

    }
);
