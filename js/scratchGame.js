/* =========================================================
   MILKSY ENGLISH ADVENTURE
   SCRATCH & MATCH — PART 1: NOUNS
========================================================= */


/* =========================================================
   PART 1 DATA
========================================================= */

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


/* =========================================================
   GAME VARIABLES
========================================================= */

let scratchScore = 0;
let scratchStreak = 0;
let scratchStars = 0;
let scratchMatches = 0;
let scratchBestStreak = 0;

let draggedWord = null;

let revealedCards = [];
let matchedWords = [];


/* =========================================================
   START GAME
========================================================= */

function openScratchGame() {

    const screen =
        document.getElementById("scratchGameScreen");

    if (!screen) {
        console.error("scratchGameScreen not found.");
        return;
    }

    screen.classList.remove("hidden");
    document.body.classList.add("scratch-mode");

    resetScratchGame();

    createScratchCards();
    createImages();

    updateScratchStats();

    updateMilksy(
        "Welcome to Scratch & Match! ✨ Pick a mystery card!"
    );
}


/* =========================================================
   RESET GAME
========================================================= */

function resetScratchGame() {

    scratchScore = 0;
    scratchStreak = 0;
    scratchStars = 0;
    scratchMatches = 0;
    scratchBestStreak = 0;

    draggedWord = null;

    revealedCards = [];
    matchedWords = [];

    const popup =
        document.getElementById("levelCompletePopup");

    if (popup) {
        popup.classList.add("hidden");
    }
}


/* =========================================================
   CLOSE GAME
========================================================= */

function closeScratchGame() {

    const screen =
        document.getElementById("scratchGameScreen");

    if (!screen) return;

    screen.classList.add("hidden");

    document.body.classList.remove("scratch-mode");

    updateMilksy(
        "Welcome back! Choose another part. 🌸"
    );
}


/* =========================================================
   CREATE 9 SCRATCH CARDS
========================================================= */

function createScratchCards() {

    const grid =
        document.getElementById("scratchGrid");

    if (!grid) {
        console.error("scratchGrid not found.");
        return;
    }

    grid.innerHTML = "";

    /*
       Shuffle the nouns so the same word
       is not always in the same position.
    */

    const shuffledNouns =
        [...nouns].sort(() => Math.random() - 0.5);


    shuffledNouns.forEach((item, index) => {

        const card =
            document.createElement("div");

        card.className = "scratch-card";

        card.dataset.word = item.word;

        card.innerHTML = `

            <div class="scratch-cover">

                <div class="scratch-star">
                    ✨
                </div>

                <div class="scratch-text">
                    Scratch Me!
                </div>

                <div class="scratch-number">
                    ${index + 1}
                </div>

            </div>

        `;


        /*
           Click only reveals the card.
           It does NOT immediately match anything.
        */

        card.addEventListener(
            "click",
            function () {

                revealScratchCard(card, item);

            }
        );


        grid.appendChild(card);

    });
}


/* =========================================================
   REVEAL SCRATCH CARD
========================================================= */

function revealScratchCard(card, item) {

    /*
       Don't allow a card to be revealed twice.
    */

    if (
        card.classList.contains("revealed") ||
        card.classList.contains("matched")
    ) {
        return;
    }


    card.classList.add("revealed");


    /*
       Remember the revealed word.
    */

    revealedCards.push(item.word);


    /*
       Replace the scratch cover
       with the actual word.
    */

    card.innerHTML = `

        <div class="revealed-word">

            <span class="word-icon">
                💭
            </span>

            <span>
                ${item.word}
            </span>

        </div>

    `;


    /*
       Make the card draggable.
    */

    card.draggable = true;


    card.addEventListener(
        "dragstart",
        function (event) {

            draggedWord = item.word;

            event.dataTransfer.setData(
                "text/plain",
                item.word
            );

            card.classList.add("dragging");

        }
    );


    card.addEventListener(
        "dragend",
        function () {

            card.classList.remove("dragging");

        }
    );


    updateMilksy(
        `You discovered "${item.word}"! 🎉 Drag it to the matching picture!`
    );


    playScratchSound();

}


/* =========================================================
   CREATE IMAGE CARDS
========================================================= */

function createImages() {

    const grid =
        document.getElementById("imageGrid");

    if (!grid) {
        console.error("imageGrid not found.");
        return;
    }

    grid.innerHTML = "";


    /*
       Shuffle the pictures.
    */

    const shuffled =
        [...nouns].sort(
            () => Math.random() - 0.5
        );


    shuffled.forEach((item) => {

        const card =
            document.createElement("div");

        card.className = "picture-card";

        card.dataset.word = item.word;


        /*
           IMPORTANT:
           We deliberately DON'T show
           the word below the picture.
        */

        card.innerHTML = `

            <div class="picture-holder">

                <img
                    src="${item.image}"
                    alt="${item.word}"
                    draggable="false"
                >

            </div>

        `;


        /*
           Drag events
        */

        card.addEventListener(
            "dragover",
            allowDrop
        );


        card.addEventListener(
            "dragenter",
            function () {

                card.classList.add("drop-ready");

            }
        );


        card.addEventListener(
            "dragleave",
            function () {

                card.classList.remove("drop-ready");

            }
        );


        card.addEventListener(
            "drop",
            dropWord
        );


        grid.appendChild(card);

    });
}


/* =========================================================
   ALLOW DROP
========================================================= */

function allowDrop(event) {

    event.preventDefault();

}


/* =========================================================
   DROP WORD ON IMAGE
========================================================= */

function dropWord(event) {

    event.preventDefault();


    const picture =
        event.currentTarget;


    picture.classList.remove(
        "drop-ready"
    );


    /*
       Get dragged word.
    */

    const word =
        draggedWord ||
        event.dataTransfer.getData("text/plain");


    if (!word) {

        return;

    }


    const correctWord =
        picture.dataset.word;


    /* =====================================================
       CORRECT MATCH
    ===================================================== */

    if (word === correctWord) {

        /*
           Don't allow the same picture
           to be matched twice.
        */

        if (
            picture.classList.contains("correct")
        ) {

            return;

        }


        picture.classList.add("correct");


        /*
           Find the scratch card.
        */

        const matchingScratchCard =
            document.querySelector(
                `.scratch-card[data-word="${CSS.escape(word)}"]`
            );


        if (matchingScratchCard) {

            matchingScratchCard.classList.add(
                "matched"
            );

            matchingScratchCard.draggable = false;

        }


        /*
           Score
        */

        scratchScore += 10;

        scratchMatches++;

        scratchStreak++;

        scratchStars++;


        /*
           Best streak
        */

        if (
            scratchStreak >
            scratchBestStreak
        ) {

            scratchBestStreak =
                scratchStreak;

        }


        /*
           Remember matched word
        */

        matchedWords.push(word);


        updateScratchStats();


        updateMilksy(
            `Wonderful! ${word} matches! ⭐`
        );


        playCorrectSound();


        /*
           Small success animation
        */

        picture.classList.add(
            "match-pop"
        );


        setTimeout(
            () => {

                picture.classList.remove(
                    "match-pop"
                );

            },
            500
        );


        /*
           Check completion
        */

        if (
            scratchMatches === nouns.length
        ) {

            completeScratchGame();

        }

    }


    /* =====================================================
       WRONG MATCH
    ===================================================== */

    else {

        picture.classList.add(
            "wrong"
        );


        scratchStreak = 0;


        updateScratchStats();


        updateMilksy(
            "Oops! That's not the right picture. Try again! 💭"
        );


        playWrongSound();


        setTimeout(
            () => {

                picture.classList.remove(
                    "wrong"
                );

            },
            700
        );

    }


    draggedWord = null;

}


/* =========================================================
   UPDATE GAME STATS
========================================================= */

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


    if (score) {

        score.textContent =
            scratchScore;

    }


    if (streak) {

        streak.textContent =
            scratchStreak;

    }


    if (stars) {

        stars.textContent =
            scratchStars;

    }


    if (starCount) {

        starCount.textContent =
            scratchStars;

    }


    if (matchCount) {

        matchCount.textContent =
            scratchMatches;

    }


    if (bestStreak) {

        bestStreak.textContent =
            scratchBestStreak;

    }


    if (progressText) {

        progressText.textContent =
            `${scratchMatches} / ${nouns.length} Matched`;

    }


    if (progressFill) {

        const percentage =
            (scratchMatches / nouns.length) * 100;

        progressFill.style.width =
            `${percentage}%`;

    }

}


/* =========================================================
   COMPLETE PART 1
========================================================= */

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
        700
    );

}


/* =========================================================
   MILKSY MESSAGE
========================================================= */

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


/* =========================================================
   SOUNDS
========================================================= */

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

        audio.play().catch(
            () => {}
        );

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

        audio.play().catch(
            () => {}
        );

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

        audio.play().catch(
            () => {}
        );

    }

}


/* =========================================================
   BUTTON CONNECTIONS
========================================================= */

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


        /*
           PART 1
        */

        if (part1) {

            part1.addEventListener(
                "click",
                function () {

                    openScratchGame();

                }
            );

        }


        /*
           BACK BUTTON
        */

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
