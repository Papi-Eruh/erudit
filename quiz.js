import { bus, newQuizEventName } from './bus.js';
import { addCard } from './db.js';

document.getElementById('save-quiz-btn').onclick = async () => {
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
