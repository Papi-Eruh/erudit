import { bus, newQuizEventName } from "./bus.js";

const darkBtn = document.getElementById('dark-btn');
const sBgContainer = document.getElementById("s-bg-container");
const mBgContainer = document.getElementById("m-bg-container");
const bgCanvas = document.getElementById("bg-canvas");
const main = document.querySelector('main');
const isMedium = window.matchMedia("(min-width: 601px)");

let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentTheme = localStorage.getItem('theme') || 'japan';
let bgRiveInputs = [];
let bgRive = null;

const themeColors = {
  japan: "#F48FB1",
  egypt: "#01687D"
};

darkBtn.onclick = toggleDarkMode;

document.getElementById('themes').onclick = (e) => {
  const btn = e.target.closest('a[data-theme]');
  if (btn) updateTheme(btn.dataset.theme);
};

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('darkMode', isDarkMode);
  updateDarkMode(true);
}

function triggerThemeTransition() {
  document.body.classList.add('theme-switching');
  setTimeout(() => {
    document.body.classList.remove('theme-switching');
  }, 1200);
}

function updateDarkMode(isActive) {
  if (isActive) triggerThemeTransition();
  ui("mode", isDarkMode ? "dark" : "light");
  darkBtn.checked = isDarkMode;
  if (bgRive) {
    const inputs = bgRive.stateMachineInputs('©2024_alexis_deslandes_erudit.app');
    const input = inputs ? inputs.find(i => i.name === 'darkmode') : null;
    if (input) input.value = isDarkMode;
  }
}

function updateTheme(themeName) {
  triggerThemeTransition();
  localStorage.setItem('theme', themeName);
  initBgRive(themeName);
  ui("theme", themeColors[themeName] || themeColors.japan);
}

function initBgRive(themeName) {
  if (bgRive) bgRive.cleanup();

  bgRive = new rive.Rive({
    src: `assets/themes/${themeName}.riv`,
    canvas: bgCanvas,
    stateMachines: '©2024_alexis_deslandes_erudit.app',
    layout: new rive.Layout({ fit: 'cover', alignment: 'center' }),
    autoplay: true,
    onLoad: () => {
      bgRive.resizeDrawingSurfaceToCanvas();
      bgRiveInputs = bgRive.stateMachineInputs('©2024_alexis_deslandes_erudit.app');
      if (bgRiveInputs) {
        const appearTrigger = bgRiveInputs.find(i => i.name === 'Appear');
        if (appearTrigger) appearTrigger.fire();
        const darkModeInput = bgRiveInputs.find(i => i.name === 'darkmode');
        if (darkModeInput) darkModeInput.value = isDarkMode;
      }
    }
  });
}

function handleLayoutChange(e) {
  if (e.matches) {
    mBgContainer.appendChild(bgCanvas);
    main.className = "middle-align center-align";
  } else {
    sBgContainer.appendChild(bgCanvas);
    main.className = "bottom-align center-align";
  }
  bgRive.resizeDrawingSurfaceToCanvas();
}

updateDarkMode();
initBgRive(currentTheme);
handleLayoutChange(isMedium);
ui("theme", themeColors[currentTheme] || themeColors.japan);


isMedium.addEventListener("change", handleLayoutChange);
window.addEventListener('resize', () => {
  bgRive.resizeDrawingSurfaceToCanvas();
});

bus.addEventListener(newQuizEventName, () => {
  const owlTrigger = bgRiveInputs.find(i => i.name === 'Owl');
  if (owlTrigger) owlTrigger.fire();
});
