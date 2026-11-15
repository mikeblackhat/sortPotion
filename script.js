/**
 * Potion Sort - Lógica del juego
 */

const LEVELS = [
  // Nivel 1
  [
    [1, 2, 2, 3],
    [3, 1, 3, 3],
    [4, 2, 2, 1],
    [1, 4, 4, 4],
    [],
    []
  ],
  // Nivel 2
  [
    [4, 2, 1, 2],
    [1, 4, 2, 2],
    [3, 4, 4, 3],
    [3, 1, 3, 1],
    [],
    []
  ],
  // Nivel 3
  [
    [1, 2, 4, 3],
    [1, 2, 3, 2],
    [4, 2, 1, 3],
    [4, 1, 4, 3],
    [],
    []
  ]
];

const MAX_CAPACITY = 4;

let currentLevel = 0;
let moves = 0;
let selectedTube = null;
let isAnimating = false;
let tubesState = [];

// Elementos DOM
const shelf = document.querySelector('.shelf');
const tubeElements = Array.from(document.querySelectorAll('.tube'));
const levelOutput = document.querySelector('.hud .level');
const movesOutput = document.querySelector('.hud .moves');
const finalMovesOutput = document.querySelector('.final');
const winModal = document.querySelector('.win-modal');
const nextBtn = winModal.querySelector('.next');
const toNextSpan = nextBtn.querySelector('.to-next');
const toFirstSpan = nextBtn.querySelector('.to-first');
const restartButtons = document.querySelectorAll('.restart');

function initGame() {
  loadLevel(0);

  // Event listeners para tubos
  tubeElements.forEach((tube, idx) => {
    tube.style.setProperty('--idx', idx);
    tube.addEventListener('click', () => handleTubeClick(idx));
  });

  // Botones de reinicio
  restartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadLevel(currentLevel);
      winModal.classList.remove('active');
    });
  });

  // Botón de siguiente nivel
  nextBtn.addEventListener('click', () => {
    const nextLvl = (currentLevel + 1) % LEVELS.length;
    loadLevel(nextLvl);
    winModal.classList.remove('active');
  });
}

function loadLevel(levelIndex) {
  currentLevel = levelIndex;
  moves = 0;
  selectedTube = null;
  isAnimating = false;
  tubesState = LEVELS[levelIndex].map(tube => [...tube]);

  levelOutput.textContent = currentLevel + 1;
  movesOutput.textContent = moves;

  // Actualizar texto del botón según nivel
  if (currentLevel === LEVELS.length - 1) {
    toNextSpan.style.display = 'none';
    toFirstSpan.style.display = 'inline';
  } else {
    toNextSpan.style.display = 'inline';
    toFirstSpan.style.display = 'none';
  }

  renderBoard();
}

function renderBoard() {
  tubesState.forEach((tube, tubeIdx) => {
    const tubeEl = tubeElements[tubeIdx];
    const layers = tubeEl.querySelectorAll('.liquid i');

    // Estado levantado
    const isLifted = selectedTube === tubeIdx ? '1' : '0';
    tubeEl.style.setProperty('--lifted', isLifted);
    tubeEl.setAttribute('aria-pressed', isLifted === '1' ? 'true' : 'false');
    tubeEl.style.setProperty('--hh', tube.length);

    // Renderizar las 4 capas de poción
    layers.forEach((layer, layerIdx) => {
      const color = tube[layerIdx] || 0;
      layer.style.setProperty('--c', color);
      layer.style.setProperty('--top', (layerIdx === tube.length - 1 && color > 0) ? '1' : '0');
    });
  });
}

function handleTubeClick(index) {
  if (isAnimating) return;

  // Si no hay tubo seleccionado:
  if (selectedTube === null) {
    if (tubesState[index].length > 0) {
      selectedTube = index;
      renderBoard();
    }
    return;
  }

  // Si toca el mismo tubo: deseleccionar
  if (selectedTube === index) {
    selectedTube = null;
    renderBoard();
    return;
  }

  // Intentar verter de selectedTube a index
  const fromIdx = selectedTube;
  const toIdx = index;
  const fromTube = tubesState[fromIdx];
  const toTube = tubesState[toIdx];

  const topColor = fromTube[fromTube.length - 1];

  // Reglas de vertido:
  // 1. El destino debe tener espacio (< 4)
  // 2. El destino debe estar vacío o su poción superior debe ser del mismo color
  const canPour = toTube.length < MAX_CAPACITY && (toTube.length === 0 || toTube[toTube.length - 1] === topColor);

  if (!canPour) {
    // Si no se puede verter, pero el tubo tocado tiene líquido, seleccionarlo
    if (toTube.length > 0) {
      selectedTube = toIdx;
    } else {
      selectedTube = null;
    }
    renderBoard();
    return;
  }

  // Calcular cuántos bloques del mismo color verter
  let countToMove = 0;
  for (let i = fromTube.length - 1; i >= 0; i--) {
    if (fromTube[i] === topColor) countToMove++;
    else break;
  }
  const spaceInTo = MAX_CAPACITY - toTube.length;
  const amountToPour = Math.min(countToMove, spaceInTo);

  executePour(fromIdx, toIdx, topColor, amountToPour);
}

function executePour(fromIdx, toIdx, color, amount) {
  isAnimating = true;
  selectedTube = null;

  // Calcular distancias y variables para la animación CSS
  const fromEl = tubeElements[fromIdx];
  const toEl = tubeElements[toIdx];

  const tubeWidth = fromEl.offsetWidth;
  const gap = (shelf.offsetWidth - (tubeWidth * 6)) / 5;
  const pitch = tubeWidth + gap;
  const dir = Math.sign(toIdx - fromIdx);
  const dx = (toIdx - fromIdx) * pitch;

  shelf.style.setProperty('--from', fromIdx + 1);
  shelf.style.setProperty('--to', toIdx + 1);
  shelf.style.setProperty('--dir', dir);
  shelf.style.setProperty('--dx', dx + 'px');
  shelf.style.setProperty('--pc', color);

  toEl.style.setProperty('--hh', tubesState[toIdx].length + amount);

  // Iniciar animaciones
  fromEl.classList.add('pouring');
  toEl.classList.add('receiving');

  // En el punto de volcado (380ms), transferir el líquido
  setTimeout(() => {
    for (let i = 0; i < amount; i++) {
      tubesState[toIdx].push(tubesState[fromIdx].pop());
    }
    moves++;
    movesOutput.textContent = moves;
    renderBoard();
    toEl.classList.add('sloshing');
  }, 420);

  // Fin de animación (1300ms)
  setTimeout(() => {
    fromEl.classList.remove('pouring');
    toEl.classList.remove('receiving');
    toEl.classList.remove('sloshing');
    fromEl.style.removeProperty('--lifted');
    renderBoard();
    isAnimating = false;

    checkWinCondition();
  }, 1320);
}

function checkWinCondition() {
  const isWon = tubesState.every(tube => {
    if (tube.length === 0) return true;
    if (tube.length === MAX_CAPACITY) {
      const firstColor = tube[0];
      return tube.every(c => c === firstColor);
    }
    return false;
  });

  if (isWon) {
    finalMovesOutput.textContent = moves;

    // Animación de celebración en los tubos
    tubeElements.forEach(tube => tube.classList.add('cheering'));

    setTimeout(() => {
      tubeElements.forEach(tube => tube.classList.remove('cheering'));
      winModal.classList.add('active');
    }, 1200);
  }
}

// Iniciar al cargar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
