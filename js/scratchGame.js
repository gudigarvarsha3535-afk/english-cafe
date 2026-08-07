/* ===========================================
SCRATCH & MATCH ENGINE
=========================================== */

let score = 0;
let streak = 0;
let stars = 0;
let matches = 0;
let bestStreak = 0;

const nouns = [

{
word:"Apple",
image:"images/nouns/apple.png"
},

{
word:"Dog",
image:"images/nouns/dog.png"
},

{
word:"Book",
image:"images/nouns/book.png"
},

{
word:"School",
image:"images/nouns/school.png"
},

{
word:"Tree",
image:"images/nouns/tree.png"
},

{
word:"Bus",
image:"images/nouns/bus.png"
},

{
word:"Chair",
image:"images/nouns/chair.png"
},

{
word:"Teacher",
image:"images/nouns/teacher.png"
},

{
word:"Cat",
image:"images/nouns/cat.png"
}

];

function createScratchCards(){

const grid =
document.getElementById("scratchGrid");

grid.innerHTML="";

nouns.forEach((item,index)=>{

const card=document.createElement("div");

card.className="scratch-card";

card.dataset.word=item.word;

card.draggable=false;

card.innerHTML="✨";

card.onclick=()=>revealCard(card,item);

grid.appendChild(card);

});

}

function revealCard(card,item){

if(card.classList.contains("revealed"))
return;

card.classList.add("revealed");

card.innerHTML=item.word;

card.draggable=true;

playScratchSound();

card.addEventListener(

"dragstart",

dragStart

);

}

let draggedWord="";

function dragStart(event){

draggedWord=

event.target.dataset.word;

}

function createImages(){

const grid=

document.getElementById("imageGrid");

grid.innerHTML="";

const shuffled=[...nouns]

.sort(()=>Math.random()-0.5);

shuffled.forEach(item=>{

const card=document.createElement("div");

card.className="picture-card";

card.dataset.word=item.word;

card.innerHTML=

`<img src="${item.image}">`;

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

function allowDrop(event){

event.preventDefault();

}

function dropWord(event){

event.preventDefault();

const picture=

event.currentTarget;

const correctWord=

picture.dataset.word;

if(draggedWord===correctWord){

picture.classList.add("correct");

matches++;

score+=10;

streak++;

stars++;

updateScore();

checkCompletion();

}

else{

picture.classList.add("wrong");

streak=0;

updateScore();

setTimeout(()=>{

picture.classList.remove("wrong");

},500);

}

}

function updateScore(){

document.getElementById("score").textContent=score;

document.getElementById("streak").textContent=streak;

document.getElementById("stars").textContent=stars;

document.getElementById("matchCount").textContent=matches;

document.getElementById("starCount").textContent=stars;

document.getElementById("bestStreak").textContent=

Math.max(bestStreak,streak);

document.getElementById("progressText").textContent=

matches+" / 9 Matched";

document.getElementById("progress-fill").style.width=

(matches/9*100)+"%";

}

function checkCompletion(){

if(matches<9)return;

document

.getElementById("levelCompletePopup")

.classList.remove("hidden");

}

window.onload=()=>{

createScratchCards();

createImages();

updateScore();

};

