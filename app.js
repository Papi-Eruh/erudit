const pages = document.querySelectorAll('#page-container > .page');
const home = document.getElementById('home');
const backBtn = document.getElementById('back-btn');

backBtn.onclick = () => window.location.hash = '#/';
window.addEventListener('hashchange', navigate);

function navigate() {
  const hash = window.location.hash || '#/';
  pages.forEach(p => p.classList.remove('active'));

  if (hash === '#/') {
    home.classList.add('active');
    backBtn.style.display = 'none';
  } else {
    const pageId = hash.replace('#/', '');
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      backBtn.style.display = 'block';
      if (pageId === 'quizzes') startQuizSession();
    } else {
      home.classList.add('active');
      backBtn.style.display = 'none';
    }
  }
}
