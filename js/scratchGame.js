document.addEventListener("DOMContentLoaded", function () {

    const part1Btn = document.getElementById("part1Btn");
    const scratchGameScreen =
        document.getElementById("scratchGameScreen");

    const backToPartsBtn =
        document.getElementById("backToPartsBtn");


    /* ================================
       OPEN SCRATCH GAME
    ================================= */

    if (part1Btn) {

        part1Btn.addEventListener("click", function () {

            console.log("Part 1 clicked");

            scratchGameScreen.classList.remove("hidden");

            document.body.classList.add("scratch-mode");


            /* Try browser fullscreen */

            if (document.documentElement.requestFullscreen) {

                document.documentElement
                    .requestFullscreen()
                    .catch(() => {
                        console.log("Fullscreen permission not available");
                    });

            }


            /* Create the cards */

            if (typeof createScratchCards === "function") {

                createScratchCards();

            } else {

                console.error(
                    "createScratchCards() is missing from scratchGame.js"
                );

            }

        });

    }


    /* ================================
       BACK TO PARTS
    ================================= */

    if (backToPartsBtn) {

        backToPartsBtn.addEventListener("click", function () {

            scratchGameScreen.classList.add("hidden");

            document.body.classList.remove("scratch-mode");


            /* Exit browser fullscreen */

            if (document.fullscreenElement) {

                document.exitFullscreen().catch(() => {});

            }

        });

    }

});

/* ==========================================
   SCRATCH & MATCH — PART 1 NOUNS
========================================== */

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


/* ==========================================
   SCRATCH GAME VARIABLES
========================================== */

let scratchScore = 0;
let scratchStreak = 0;
let scratchStars = 0;
let scratchMatches = 0;
let scratchBestStreak = 0;

let draggedWord = "";


/* ==========================================
   OPEN SCRATCH GAME
========================================== */

function openScratchGame() {

    const gameScreen =
        document.getElementById("scratchGameScreen");

    if (!gameScreen) {
        console.error("Scratch game screen not found.");
        return;
    }

    gameScreen.classList.remove("hidden");

    document.body.classList.add("scratch-mode");

    createScratchCards();
    createImages();

    updateScratchStats();

    updateMilksy(
        "Amazing! Scratch a card to discover a noun! ✨"
    );
}


/* ==========================================
   CLOSE SCRATCH GAME
========================================== */

function closeScratchGame() {

    const gameScreen =
        document.getElementById("scratchGameScreen");

    if (!gameScreen) return;

    gameScreen.classList.add("hidden");

    document.body.classList.remove("scratch-mode");

    updateMilksy(
        "Welcome back! Choose a part to continue. 🌸"
    );
}


/* ==========================================
   CREATE SCRATCH CARDS
========================================== */

function createScratchCards() {

    const grid =
        document.getElementById("scratchGrid");

    if (!grid) {
        console.error("scratchGrid not found.");
        return;
    }

    grid.innerHTML = "";

    nouns.forEach((item) => {

        const card =
            document.createElement("div");

        card.className = "scratch-card";

        card.dataset.word = item.word;

        card.innerHTML = `
            <div class="scratch-cover">
                ✨
                <span>Scratch Me!</span>
            </div>
        `;

        card.addEventListener(
            "click",
            function () {

                revealCard(card, item);

            }
        );

        grid.appendChild(card);

    });
}


/* ==========================================
   REVEAL SCRATCH CARD
========================================== */

function revealCard(card, item) {

    if (card.classList.contains("revealed")) {
        return;
    }

    card.classList.add("revealed");

    card.innerHTML = `
        <div class="revealed-word">
            ${item.word}
        </div>
    `;

    card.draggable = true;

    card.addEventListener(
        "dragstart",
        dragStart
    );

    updateMilksy(
        `You found "${item.word}"! Now drag it to the correct picture. 🎯`
    );

    playScratchSound();

}


/* ==========================================
   DRAG WORD
========================================== */

function dragStart(event) {

    draggedWord =
        event.currentTarget.dataset.word;

}


/* ==========================================
   CREATE PICTURES
========================================== */

function createImages() {

    const grid =
        document.getElementById("imageGrid");

    if (!grid) {
        console.error("imageGrid not found.");
        return;
    }

    grid.innerHTML = "";

    const shuffled =
        [...nouns].sort(
            () => Math.random() - 0.5
        );

    shuffled.forEach((item) => {

        const card =
            document.createElement("div");

        card.className = "picture-card";

        card.dataset.word =
            item.word;

        card.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.word}"
            >
            <span>${item.word}</span>
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


/* ==========================================
   ALLOW DROP
========================================== */

function allowDrop(event) {

    event.preventDefault();

}


/* ==========================================
   DROP WORD
========================================== */

function dropWord(event) {

    event.preventDefault();

    const picture =
        event.currentTarget;

    const correctWord =
        picture.dataset.word;


    /* -----------------------------
       CORRECT
    ----------------------------- */

    if (draggedWord === correctWord) {

        if (
            picture.classList.contains("correct")
        ) {
            return;
        }

        picture.classList.add("correct");

        scratchMatches++;

        scratchScore += 10;

        scratchStreak++;

        scratchStars++;

        if (
            scratchStreak >
            scratchBestStreak
        ) {

            scratchBestStreak =
                scratchStreak;

        }

        updateScratchStats();

        updateMilksy(
            `Excellent! ${correctWord} is correct! ⭐`
        );

        playCorrectSound();

        if (scratchMatches === nouns.length) {

            completeScratchGame();

        }

    }


    /* -----------------------------
       WRONG
    ----------------------------- */

    else {

        picture.classList.add("wrong");

        scratchStreak = 0;

        updateScratchStats();

        updateMilksy(
            "Almost! Try another picture. 💭"
        );

        playWrongSound();

        setTimeout(
            () => {

                picture.classList.remove(
                    "wrong"
                );

            },
            600
        );

    }

}


/* ==========================================
   UPDATE SCORE
========================================== */

function updateScratchStats() {

    const score =
        document.getElementById("score");

    const streak =
        document.getElementById("streak");

    const stars =
        document.getElementById("stars");

    const starCount =
        document.getElementById("starCount");

    const matchCount =
        document.getElementById("matchCount");

    const bestStreak =
        document.getElementById("bestStreak");

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progress-fill");


    if (score)
        score.textContent =
            scratchScore;

    if (streak)
        streak.textContent =
            scratchStreak;

    if (stars)
        stars.textContent =
            scratchStars;

    if (starCount)
        starCount.textContent =
            scratchStars;

    if (matchCount)
        matchCount.textContent =
            scratchMatches;

    if (bestStreak)
        bestStreak.textContent =
            scratchBestStreak;

    if (progressText)
        progressText.textContent =
            `${scratchMatches} / 9 Matched`;

    if (progressFill)
        progressFill.style.width =
            `${(scratchMatches / 9) * 100}%`;

}


/* ==========================================
   COMPLETE GAME
========================================== */

function completeScratchGame() {

    updateMilksy(
        "🎉 Amazing! You matched all 9 nouns!"
    );

    setTimeout(
        () => {

            const popup =
                document.getElementById(
                    "levelCompletePopup"
                );

            if (popup) {

                popup.classList.remove(
                    "hidden"
                );

            }

        },
        500
    );

}


/* ==========================================
   MILKSY MESSAGE
========================================== */

function updateMilksy(message) {

    const speech =
        document.getElementById(
            "milksyMessage"
        );

    if (speech) {

        speech.textContent =
            message;

    }

}


/* ==========================================
   SOUNDS
========================================== */

function playScratchSound() {

    const audio =
        document.getElementById(
            "scratchSound"
        );

    if (
        audio &&
        audio.src
    ) {

        audio.currentTime = 0;
        audio.play().catch(() => {});

    }

}


function playCorrectSound() {

    const audio =
        document.getElementById(
            "correctSound"
        );

    if (
        audio &&
        audio.src
    ) {

        audio.currentTime = 0;
        audio.play().catch(() => {});

    }

}


function playWrongSound() {

    const audio =
        document.getElementById(
            "wrongSound"
        );

    if (
        audio &&
        audio.src
    ) {

        audio.currentTime = 0;
        audio.play().catch(() => {});

    }

}


/* ==========================================
   CONNECT BUTTONS
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const part1 =
            document.getElementById(
                "part1Btn"
            );

        const backButton =
            document.getElementById(
                "backToPartsBtn"
            );


        /* PART 1 */

        if (part1) {

            part1.addEventListener(
                "click",
                function () {

                    openScratchGame();

                }
            );

        }


        /* BACK BUTTON */

        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    closeScratchGame();

                }
            );

        }


    }
);
