const darkBtn = document.getElementById('dark-btn');
const sBgContainer = document.getElementById("s-bg-container");
const mBgContainer = document.getElementById("m-bg-container");
const bgCanvas = document.getElementById("bg-canvas");
const main = document.querySelector('main');
const isMedium = window.matchMedia("(min-width: 601px)");

let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentTheme = localStorage.getItem('theme') || 'japan';
let bgRive = null;

darkBtn.onclick = toggleDarkMode;

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('darkMode', isDarkMode);
  updateThemeUI();
}

function updateThemeUI() {
  ui("mode", isDarkMode ? "dark" : "light");
  // document.body.className = isDarkMode ? 'dark' : 'light';
  darkBtn.checked = isDarkMode;
  if (bgRive) {
    const inputs = bgRive.stateMachineInputs('©2024_alexis_deslandes_erudit.app');
    const input = inputs ? inputs.find(i => i.name === 'darkmode') : null;
    if (input) input.value = isDarkMode;
  }
}

function initRive(themeName) {
  if (bgRive) bgRive.cleanup();

  bgRive = new rive.Rive({
    src: `assets/themes/${themeName}.riv`,
    canvas: bgCanvas,
    stateMachines: '©2024_alexis_deslandes_erudit.app',
    layout: new rive.Layout({ fit: 'cover', alignment: 'center' }),
    autoplay: true,
    onLoad: () => {
      bgRive.resizeDrawingSurfaceToCanvas();
      const inputs = bgRive.stateMachineInputs('©2024_alexis_deslandes_erudit.app');
      if (inputs) {
        const appearTrigger = inputs.find(i => i.name === 'Appear');
        if (appearTrigger) appearTrigger.fire();
        const darkModeInput = inputs.find(i => i.name === 'darkmode');
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

updateThemeUI();
initRive(currentTheme);
handleLayoutChange(isMedium);
ui("theme", "#F48FB1");


isMedium.addEventListener("change", handleLayoutChange);
window.addEventListener('resize', () => {
  bgRive.resizeDrawingSurfaceToCanvas();
});
