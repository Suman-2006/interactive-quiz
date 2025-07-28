const quizData = [
  {
    question: "Which language is used to style web pages?",
    answers: {
      a: "HTML",
      b: "JQuery",
      c: "CSS",
      d: "XML"
    },
    correct: "c",
    hint: "It controls colors, layouts, and fonts — not the structure.",
    explanation: "CSS stands for Cascading Style Sheets, used for styling HTML content."
  },
  {
  question: "What is the correct HTML element for inserting a line break?",
  answers: {
    a: "&lt;break&gt;",
    b: "&lt;br&gt;",
    c: "&lt;lb&gt;",
    d: "&lt;b&gt;"
  },
  correct: "b",
  hint: "It's a self-closing tag used to start text on a new line.",
  explanation: "&lt;br&gt; is the HTML tag for line break."
},
  {
    question: "Which of the following is a JavaScript framework?",
    answers: {
      a: "Django",
      b: "Laravel",
      c: "React",
      d: "Flask"
    },
    correct: "c",
    hint: "It's developed by Meta and is used to build UI components.",
    explanation: "React is a JS library/framework used for building UI."
  },
  {
    question: "Which property is used to change the background color?",
    answers: {
      a: "bgcolor",
      b: "color",
      c: "backgroundColor",
      d: "background"
    },
    correct: "d",
    hint: "This CSS shorthand property affects background-image, position, repeat, etc.",
    explanation: "The 'background' property can set all background values at once."
  },
  {
    question: "Which symbol is used for single-line comments in JavaScript?",
    answers: {
      a: "#",
      b: "/* */",
      c: "//",
      d: "<!-- -->"
    },
    correct: "c",
    hint: "You can use this on one line — no need for closing.",
    explanation: "'//' is used for single-line comments in JavaScript."
  }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 300;
const totalTime = 300;
const quizContent = document.getElementById("quiz-content");
const progress = document.getElementById("progress-indicator");
const results = document.getElementById("results");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const timerElement = document.getElementById("time");

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

timerElement.textContent = formatTime(timeLeft);
const timer = setInterval(() => {
  timeLeft--;
  timerElement.textContent = formatTime(timeLeft);
  if (timeLeft <= 0) {
    clearInterval(timer);
    showResults();
  }
}, 1000);

function buildProgress() {
  progress.innerHTML = "";
  for (let i = 0; i < quizData.length; i++) {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    if (i < currentQuestion) circle.classList.add("completed");
    if (i === currentQuestion) circle.classList.add("active");
    circle.innerText = i + 1;
    progress.appendChild(circle);
  }
}

function loadQuestion(index) {
  const q = quizData[index];
  const options = Object.keys(q.answers).map(letter => {
    return `<label><input type="radio" name="answer" value="${letter}"> ${q.answers[letter]}</label>`;
  }).join("");

  quizContent.innerHTML = `
    ${q.image ? `<img src="${q.image}" class="quiz-image" alt="Question Image">` : ""}
    <div class="question">${q.question}</div>
    <div class="answers">${options}</div>
    <button id="hint-btn">💡 Show Hint</button>
    <div class="hint" id="hint-text" style="display:none;">${q.hint}</div>
  `;

  buildProgress();
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = true;

  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.addEventListener("change", () => {
      nextBtn.disabled = false;
    });
  });

  const hintBtn = document.getElementById("hint-btn");
  const hintText = document.getElementById("hint-text");
  hintBtn.addEventListener("click", () => {
    hintText.style.display = "block";
    hintBtn.style.display = "none";
  });
}

nextBtn.addEventListener("click", () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected && selected.value === quizData[currentQuestion].correct) {
    score++;
  }
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion(currentQuestion);
  } else {
    showResults();
  }
});

prevBtn.addEventListener("click", () => {
  currentQuestion--;
  loadQuestion(currentQuestion);
});

function showResults() {
  document.querySelector('.quiz-header').style.display = 'none';
  quizContent.innerHTML = "";
  progress.innerHTML = "";
  nextBtn.style.display = "none";
  prevBtn.style.display = "none";
  clearInterval(timer);

  const timeTaken = totalTime - timeLeft;
  const timeTakenFormatted = formatTime(timeTaken);

  let greeting = "";
  const percent = (score / quizData.length) * 100;
  if (percent === 100) greeting = "🏆 Perfect! You're a pro!";
  else if (percent >= 80) greeting = "🎉 Great job!";
  else if (percent >= 50) greeting = "👍 Good effort!";
  else greeting = "😅 Keep practicing!";

  let explanationHTML = "";
  quizData.forEach((q, i) => {
    explanationHTML += `
      <div class="explanation">
        <strong>Q${i + 1}: ${q.question}</strong><br/>
        ✅ Correct Answer: ${q.answers[q.correct]}<br/>
        💬 Explanation: ${q.explanation || "—"}
      </div><br/>
    `;
  });

  results.innerHTML = `
    <div class="result-summary">
      <h2>${greeting}</h2>
      <p>You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong></p>
      <p>⏱️ Time taken: <strong>${timeTakenFormatted}</strong></p>
      <button id="restart-btn">🔄 Restart Quiz</button>
      <hr/>
      <h3>📚 Explanations:</h3>
      ${explanationHTML}
    </div>
  `;

  document.getElementById("restart-btn").addEventListener("click", () => {
    location.reload();
  });
}

loadQuestion(currentQuestion);