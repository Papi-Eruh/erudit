import { bus, newQuizEventName } from './bus.js';
import { addCard, getDueCards, updateCard } from './db.js';

const addQuizPage = document.getElementById('/add-quiz');
const doQuizPage = document.getElementById('/do-quiz');
const quizQuestions = document.querySelectorAll('.quiz-question');
const quizAnswers = document.querySelectorAll('.quiz-answer');
const quizProgressTexts = document.querySelectorAll('.quiz-progress-text');
const quizProgressBars = document.querySelectorAll('.quiz-progress-bar');
const quizRevealBtns = document.querySelectorAll('.quiz-reveal');
const quizWrongBtns = document.querySelectorAll('.quiz-wrong');
const quizCorrectBtns = document.querySelectorAll('.quiz-correct');
const quizNextBtns = document.querySelectorAll('.quiz-next');
const quizAnswerContainers = document.querySelectorAll(".quiz-answer-container");

let pbRives = [];
let pbRiveInputs = [];
let currentDueCards = [];
let currentCardIndex = 0;

async function saveQuiz() {
  const questionElt = document.getElementById('new-question');
  const answerElt = document.getElementById('new-answer');
  const question = questionElt.value;
  const answer = answerElt.value;
  if (question && answer) {
    await addCard(question, answer);
    questionElt.value = '';
    answerElt.value = '';
    ui('#add-dialog');
    bus.dispatchEvent(new Event(newQuizEventName));
  }
};

function setButtonsActive(buttons, active) {
  buttons.forEach(b => {
    b.disabled = !active;
    if (active) b.classList.add('active');
    else b.classList.remove('active');
  });
}

function revealAnswer() {
  quizAnswerContainers.forEach(c => c.classList.add('active'));
  setButtonsActive(quizRevealBtns, false);
  setButtonsActive(quizWrongBtns, true);
  setButtonsActive(quizCorrectBtns, true);
}

function showCard() {
  quizAnswerContainers.forEach(c => c.classList.remove('active'));
  const card = currentDueCards[currentCardIndex];
  quizQuestions.forEach(q => q.textContent = card.question);
  quizAnswers.forEach(a => a.textContent = card.answer);

  setButtonsActive(quizRevealBtns, true);
  setButtonsActive(quizWrongBtns, false);
  setButtonsActive(quizCorrectBtns, false);
  setButtonsActive(quizNextBtns, false);

  const quizValue = currentCardIndex + 1;
  const quizTotal = currentDueCards.length;
  quizProgressTexts.forEach(t => t.textContent = `${quizValue}/${quizTotal}`);
  quizProgressBars.forEach(p => {
    p.value = quizValue;
    p.max = quizTotal;
  });

  initPbRive(card.repetitions);
}

function showAddQuiz() {
  addQuizPage.classList.add('active');
  doQuizPage.classList.remove('active');
}

export async function initQuizView() {
  currentDueCards = await getDueCards();
  currentCardIndex = 0;
  if (currentDueCards.length === 0) {
    return showAddQuiz();
  }
  showCard();
}


function goNextCard() {
  if (++currentCardIndex < currentDueCards.length) {
    return showCard();
  }
  //TODO: animate Hudit bravo
  showAddQuiz();
}

async function handleReview(success) {
  const card = currentDueCards[currentCardIndex];
  await updateCard(card, success);
  setButtonsActive(quizNextBtns, true);
  setButtonsActive(quizWrongBtns, false);
  setButtonsActive(quizCorrectBtns, false);
  pbRiveInputs.forEach(input => input.value = Math.min(card.repetitions, 7));
}

function initPbRive(repetitions) {
  pbRives.forEach(r => r.cleanup());
  pbRives = [];
  pbRiveInputs = [];

  document.querySelectorAll('.question-pb').forEach(canvas => {
    const r = new rive.Rive({
      src: 'assets/animations/progress_bar.riv',
      canvas: canvas,
      autoplay: true,
      stateMachines: '©2024_alexis_deslandes_erudit.app',
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        const inputs = r.stateMachineInputs('©2024_alexis_deslandes_erudit.app');
        if (inputs) {
          const levelInput = inputs.find(i => i.name === 'Level');
          if (levelInput) {
            levelInput.value = Math.min(repetitions, 7);
            pbRiveInputs.push(levelInput);
          }
        }
      }
    });
    pbRives.push(r);
  });
}

document.getElementById('save-quiz-btn').onclick = saveQuiz;
quizRevealBtns.forEach(btn => btn.onclick = revealAnswer);
quizWrongBtns.forEach(btn => btn.onclick = () => handleReview(false));
quizCorrectBtns.forEach(btn => btn.onclick = () => handleReview(true));
quizNextBtns.forEach(btn => btn.onclick = goNextCard);
