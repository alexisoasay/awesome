let kidName = "";
let currentCategory = "";
let difficulty = "";
let words = [];
let currentIndex = 0;
let score = 0;
let currentHint = "";

const wordBank = {
  Name: {
    Easy: [
      "boy","girl","man","woman","baby","friend","teacher","doctor","nurse","farmer",
      "student","driver","singer","dancer","baker"
    ],
    Difficult: [
      "cook","painter","police","waiter","janitor","gardener","pilot","soldier","artist",
      "tailor","librarian","mechanic","carpenter","butcher","cashier"
    ]
  },
  Place: {
    Easy: [
      "zoo","park","farm","lake","city","town","beach","store","river","desert",
      "garden","forest","bakery","castle","circus"
    ],
    Difficult: [
      "country","school","museum","hospital","campsite","airport","library","aquarium",
      "playground","fire station","post office","train station","police station",
      "mountain","ocean"
    ]
  },
  Thing: {
    Easy: [
      "ball","cup","book","pen","hat","bed","chair","shoe","clock","door",
      "table","window","apple","bread","plate"
    ],
    Difficult: [
      "spoon","fork","bottle","pillow","blanket","backpack","bicycle","camera",
      "hammer","toothbrush","magazine","calculator","ruler","telescope","microscope"
    ]
  },
  Animal: {
    Easy: [
      "cat","dog","pig","cow","hen","fish","fox","duck","bird","frog",
      "goat","lion","sheep","mouse","rabbit"
    ],
    Difficult: [
      "chicken","turtle","tiger","snake","horse","zebra","ostrich","monkey","carabao",
      "giraffe","butterfly","elephant","caterpillar","cockroach","crocodile"
    ]
  },
  Event: {
    Easy: [
      "gala","bash","ball","prom","expo","rally","feast","brunch","social","fete",
      "summit","jubilee","retreat","potluck","pageant"
    ],
    Difficult: [
      "concert","assembly","festival","workshop","thanksgiving","symposium","colloquium",
      "convention","conference","exhibition","celebration","inauguration","presentation",
      "commemoration","consecration"
    ]
  }
};

function makeHint(word) {
  let letters = word.split("");
  let indexes = [];

  const lettersToHide = Math.min(Math.max(2, Math.floor(word.length / 2)), word.length - 1);

  while (indexes.length < lettersToHide) {
    let rand = Math.floor(Math.random() * word.length);
    if (!indexes.includes(rand) && letters[rand] !== " ") {
      indexes.push(rand);
    }
  }

  indexes.forEach(i => (letters[i] = "_"));
  return letters.join("");
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1;
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function startGameIntro() {
  const nameInput = document.getElementById("kid-name");
  kidName = nameInput.value.trim();

  if (kidName === "") {
    alert("Please enter your name first!");
    return;
  }

  document.getElementById("display-name").textContent = kidName;
  showSection("categories");
}

function chooseCategory(category) {
  currentCategory = category;
  showSection("difficulty");
}

function startSpelling(level) {
  difficulty = level;

  words = [...wordBank[currentCategory][difficulty]].sort(() => Math.random() - 0.5);

  currentIndex = 0;
  score = 0;
  currentHint = "";

  document.getElementById("category-title").textContent =
    `${currentCategory} (${difficulty} Mode)`;
  document.getElementById("score").textContent = `Score: 0/${words.length}`;
  document.getElementById("feedback").textContent = "";
  document.getElementById("word-hint").textContent = "";
  document.getElementById("answer").value = "";

  showSection("game");
  playWord(true); 
}

function playWord(isNew = false) {
  const word = words[currentIndex];
  speak(word);

  if (difficulty === "Easy") {
    if (isNew || currentHint === "") {
      currentHint = makeHint(word); 
    }
    document.getElementById("word-hint").textContent = `Hint: ${currentHint}`;
  } else {
    document.getElementById("word-hint").textContent = "";
  }
}

function checkAnswer() {
  const answer = document.getElementById("answer").value.trim().toLowerCase();
  const correctWord = words[currentIndex].toLowerCase();
  const feedback = document.getElementById("feedback");

  if (answer === "") return;

  if (answer === correctWord) {
    feedback.textContent = `✅ Great job, ${kidName}!`;
    feedback.style.color = "green";
    score++;
  } else {
    feedback.textContent = `❌ Oops! The word was "${correctWord}".`;
    feedback.style.color = "red";
  }

  document.getElementById("score").textContent = `Score: ${score}/${words.length}`;

  setTimeout(() => {
    nextWord();
  }, 1500);
}

function nextWord() {
  currentIndex++;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("word-hint").textContent = "";
  currentHint = "";

  if (currentIndex < words.length) {
    playWord(true);
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("final-name").textContent = kidName;
  document.getElementById("final-score").textContent =
    `You scored ${score} out of ${words.length}!`;
  showSection("result");
  speak(`Great job, ${kidName}! You got ${score} correct!`);
}

function restart() {
  document.getElementById("kid-name").value = "";
  showSection("home");
}
