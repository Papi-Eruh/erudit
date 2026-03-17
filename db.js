const DB_NAME = 'eruditDB';
const DB_VERSION = 1;
const STORE_NAME = 'flashcards';

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export async function addCard(question, answer) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    let nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    const card = {
      question,
      answer,
      nextReview: nextReview.getTime(),
      interval: 0,
      ease: 2.5,
      repetitions: 0
    };
    const request = store.add(card);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDueCards() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      const dueCards = request.result.filter(card => {
        const cardDate = new Date(card.nextReview);
        cardDate.setHours(0, 0, 0, 0);
        return cardDate.getTime() <= todayTimestamp;
      });

      resolve(dueCards);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function updateCard(card, success) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    if (success) {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.ease);
      }
      card.repetitions += 1;
      card.ease = card.ease + 0.1;
    } else {
      card.repetitions = 0;
      card.interval = 1;
      card.ease = Math.max(1.3, card.ease - 0.2);
    }

    card.nextReview = Date.now() + card.interval * 24 * 60 * 60 * 1000;

    const request = store.put(card);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
