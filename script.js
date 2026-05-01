/* script.js */

const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
const searchForm = document.querySelector('.search-form');

const shortcutsContainer = document.getElementById('shortcuts-container');

const modal = document.getElementById('add-modal');
const inputName = document.getElementById('shortcut-name');
const inputUrl = document.getElementById('shortcut-url');
const btnSave = document.getElementById('modal-save');
const btnCancel = document.getElementById('modal-cancel');

const menuBtn = document.getElementById('google-menu-btn');
const appsGrid = document.getElementById('google-apps-grid');

const clockText = document.getElementById('clock-text');
const greetingTitle = document.getElementById('greeting-title');
const greetingAge = document.getElementById('greeting-age');

const calendarTitle = document.getElementById('calendar-title');
const calendarSubtitle = document.getElementById('calendar-subtitle');
const calendarGrid = document.getElementById('calendar-grid');
const calendarPrev = document.getElementById('calendar-prev');
const calendarNext = document.getElementById('calendar-next');
const dailyToday = document.getElementById('daily-today');
const commandVault = document.getElementById('command-vault');
const commandTabs = document.getElementById('command-tabs');
const commandList = document.getElementById('command-list');
const toolBubbleStage = document.getElementById('tool-bubble-stage');
const toolBubbleSvg = document.getElementById('tool-bubble-svg');
const toolBubbleLinks = document.getElementById('tool-bubble-links');
const bayernCompetition = document.getElementById('bayern-competition');
const bayernHomeLogo = document.getElementById('bayern-home-logo');
const bayernHomeName = document.getElementById('bayern-home-name');
const bayernHomeScore = document.getElementById('bayern-home-score');
const bayernAwayLogo = document.getElementById('bayern-away-logo');
const bayernAwayName = document.getElementById('bayern-away-name');
const bayernAwayScore = document.getElementById('bayern-away-score');
const bayernStatus = document.getElementById('bayern-status');
const bayernDetail = document.getElementById('bayern-detail');

/* =========================
   默认快捷方式
========================= */
const DEFAULT_SHORTCUTS = [
  {
    name: 'Spotify',
    url: 'https://open.spotify.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png'
  },
  {
    name: 'Discord',
    url: 'https://discord.com/channels/@me',
    icon: 'https://www.google.com/s2/favicons?sz=128&domain=discord.com'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com',
    icon: 'https://www.google.com/s2/favicons?sz=256&domain=instagram.com'
  },
  {
    name: 'LeetCode',
    url: 'https://leetcode.com/problemset/',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png'
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  }
];

const TOOL_BUBBLE_APPS = [
  {
    label: 'Gmail',
    url: 'https://mail.google.com',
    icon: 'gmail'
  },
  {
    label: 'Docs',
    url: 'https://docs.google.com/document/u/0/',
    icon: 'docs'
  },
  {
    label: 'Drive',
    url: 'https://drive.google.com',
    icon: 'drive'
  },
  {
    label: 'Calendar',
    url: 'https://calendar.google.com',
    icon: 'calendar'
  },
  {
    label: 'Notion',
    url: 'https://www.notion.so',
    icon: 'notion'
  },
  {
    label: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: 'chatgpt'
  },
  {
    label: 'GitHub',
    url: 'https://github.com',
    icon: 'github'
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com',
    icon: 'youtube'
  },
  {
    label: 'Maps',
    url: 'https://www.google.com/maps',
    icon: 'maps'
  },
  {
    label: 'Keep',
    url: 'https://keep.google.com',
    icon: 'keep'
  }
];

/* =========================
   Google 工具栏逻辑（可选）
========================= */
if (menuBtn && appsGrid) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    appsGrid.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !appsGrid.contains(e.target)) {
      appsGrid.classList.remove('active');
    }
  });
}

/* =========================
   快捷方式管理
========================= */
function getStoredShortcuts() {
  let shortcuts = [];

  try {
    shortcuts = JSON.parse(localStorage.getItem('p3r_shortcuts')) || [];
  } catch (err) {
    shortcuts = [];
  }

  if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
    shortcuts = [...DEFAULT_SHORTCUTS];
    localStorage.setItem('p3r_shortcuts', JSON.stringify(shortcuts));
  }

  return shortcuts;
}

function saveShortcuts(shortcuts) {
  localStorage.setItem('p3r_shortcuts', JSON.stringify(shortcuts));
}

function createShortcutElement(item, index) {
  const a = document.createElement('a');
  a.href = item.url;
  a.className = 'shortcut-item';
  a.title = item.name;
  a.target = '_self';

  const img = document.createElement('img');
  img.src = item.icon;
  img.alt = item.name;
  img.loading = 'lazy';

  const delBtn = document.createElement('div');
  delBtn.className = 'delete-btn';
  delBtn.textContent = 'x';
  delBtn.title = 'Remove';
  delBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeShortcut(index);
  });

  a.appendChild(img);
  a.appendChild(delBtn);
  return a;
}

function createAddButton() {
  const addBtn = document.createElement('div');
  addBtn.className = 'shortcut-item add-shortcut-btn';
  addBtn.textContent = '+';
  addBtn.title = 'Add Shortcut';
  addBtn.addEventListener('click', openModal);
  return addBtn;
}

function loadAndRenderShortcuts() {
  if (!shortcutsContainer) return;

  const shortcuts = getStoredShortcuts();
  shortcutsContainer.innerHTML = '';

  shortcuts.forEach((item, index) => {
    const shortcutEl = createShortcutElement(item, index);
    shortcutsContainer.appendChild(shortcutEl);
  });

  shortcutsContainer.appendChild(createAddButton());
}

function removeShortcut(index) {
  const shortcuts = getStoredShortcuts();
  shortcuts.splice(index, 1);
  saveShortcuts(shortcuts);
  loadAndRenderShortcuts();
}

function openModal() {
  if (!modal) return;

  modal.style.display = 'flex';

  if (inputName) inputName.value = '';
  if (inputUrl) inputUrl.value = '';
  if (inputName) inputName.focus();
}

function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';
}

function normalizeUrl(url) {
  let finalUrl = url.trim();

  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'https://' + finalUrl;
  }

  return finalUrl;
}

function getFaviconUrlFromDomain(url) {
  let domain = url;

  try {
    domain = new URL(url).hostname;
  } catch (err) {
    // fallback
  }

  return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
}

function saveShortcut() {
  if (!inputName || !inputUrl) return;

  const name = inputName.value.trim();
  let url = inputUrl.value.trim();

  if (!name || !url) return;

  url = normalizeUrl(url);

  const iconUrl = getFaviconUrlFromDomain(url);
  const shortcuts = getStoredShortcuts();

  shortcuts.push({
    name,
    url,
    icon: iconUrl
  });

  saveShortcuts(shortcuts);
  closeModal();
  loadAndRenderShortcuts();
}

/* =========================
   Tool bubble panel
========================= */
const TOOL_BUBBLE_COLS = 2;
const TOOL_BUBBLE_ROWS = Math.ceil(TOOL_BUBBLE_APPS.length / TOOL_BUBBLE_COLS);
const TOOL_BUBBLE_POINTS = 36;
const TOOL_BUBBLE_EASE = 0.16;
const TOOL_BUBBLE_SETTLE_DISTANCE = 0.16;

function getToolBubbleIcon(type) {
  const common = 'class="tool-bubble-drawn-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"';
  const icons = {
    gmail: `<svg ${common}><path d="M8 14h32v22H8z" fill="none" stroke="#2f4e68" stroke-width="3" stroke-linejoin="round"/><path d="M9 15l15 12 15-12" fill="none" stroke="#d84b45" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 35V17l12 10" fill="none" stroke="#4a90d9" stroke-width="3" stroke-linecap="round"/><path d="M39 35V17L27 27" fill="none" stroke="#49a566" stroke-width="3" stroke-linecap="round"/></svg>`,
    docs: `<svg ${common}><path d="M15 7h14l7 7v27H15z" fill="#f7fbff" stroke="#2f6fbb" stroke-width="3" stroke-linejoin="round"/><path d="M29 7v8h7" fill="none" stroke="#2f6fbb" stroke-width="3" stroke-linejoin="round"/><path d="M20 22h12M20 28h12M20 34h8" stroke="#2f6fbb" stroke-width="3" stroke-linecap="round"/></svg>`,
    drive: `<svg ${common}><path d="M18 8h12l14 24-6 8H26z" fill="none" stroke="#2f4e68" stroke-width="3" stroke-linejoin="round"/><path d="M18 8L4 32l6 8 14-24z" fill="#f2c94c" stroke="#2f4e68" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 8L16 32h28z" fill="#4a90d9" stroke="#2f4e68" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 40h28L24 16z" fill="#49a566" stroke="#2f4e68" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
    calendar: `<svg ${common}><rect x="9" y="10" width="30" height="29" rx="4" fill="#f7fbff" stroke="#2f6fbb" stroke-width="3"/><path d="M9 18h30" stroke="#d84b45" stroke-width="4"/><path d="M17 7v7M31 7v7" stroke="#2f4e68" stroke-width="3" stroke-linecap="round"/><path d="M18 27h12M18 33h7" stroke="#2f6fbb" stroke-width="3" stroke-linecap="round"/></svg>`,
    notion: `<svg ${common}><path d="M10 10l23-2 5 5v25l-25 2-5-5V12z" fill="#f8fbff" stroke="#263846" stroke-width="3" stroke-linejoin="round"/><path d="M17 18h5l10 14V18h4M17 32h4V20" stroke="#263846" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chatgpt: `<svg ${common}><path d="M24 7c4 0 7 2 8 6 4 1 7 4 7 8 0 3-1 5-4 7 0 4-3 8-7 9-3 1-6 0-8-2-4 1-8-1-10-5-2-3-1-7 1-9-1-4 1-8 5-10 2-3 5-4 8-4z" fill="none" stroke="#2d766f" stroke-width="3" stroke-linejoin="round"/><path d="M17 16l14 8-14 8M31 16l-14 8 14 8" fill="none" stroke="#2d766f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    github: `<svg ${common}><path d="M24 8c-9 0-16 7-16 16 0 7 4 13 11 15v-6c-4 1-5-2-5-2-1-2-2-3-2-3-2-1 0-1 0-1 2 0 3 2 3 2 2 3 5 2 6 1 0-1 1-2 2-3-4 0-8-2-8-8 0-2 1-4 2-5 0-1-1-3 0-5 0 0 2-1 6 2 2-1 5-1 7 0 4-3 6-2 6-2 1 2 0 4 0 5 1 1 2 3 2 5 0 6-4 8-8 8 1 1 2 3 2 5v6c7-2 11-8 11-15 0-9-7-16-16-16z" fill="#273746"/></svg>`,
    youtube: `<svg ${common}><rect x="7" y="14" width="34" height="22" rx="7" fill="#d84b45"/><path d="M21 20l10 5-10 5z" fill="#fff"/></svg>`,
    maps: `<svg ${common}><path d="M24 6c7 0 13 5 13 12 0 9-13 24-13 24S11 27 11 18C11 11 17 6 24 6z" fill="#f7fbff" stroke="#2f4e68" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="18" r="5" fill="#4a90d9"/><path d="M15 34l18-18" stroke="#49a566" stroke-width="3" stroke-linecap="round"/><path d="M19 11l15 15" stroke="#d84b45" stroke-width="3" stroke-linecap="round"/></svg>`,
    keep: `<svg ${common}><path d="M12 8h24v22l-8 10H12z" fill="#f2c94c" stroke="#6b5a22" stroke-width="3" stroke-linejoin="round"/><path d="M28 40V30h8" fill="none" stroke="#6b5a22" stroke-width="3" stroke-linejoin="round"/><path d="M19 18h10M19 24h8" stroke="#6b5a22" stroke-width="3" stroke-linecap="round"/></svg>`
  };

  return icons[type] || icons.docs;
}

function createClosedCurvePath(points) {
  if (!points.length) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length; i++) {
    const previous = points[(i - 1 + points.length) % points.length];
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const afterNext = points[(i + 2) % points.length];
    const cp1x = current.x + (next.x - previous.x) / 6;
    const cp1y = current.y + (next.y - previous.y) / 6;
    const cp2x = next.x - (afterNext.x - current.x) / 6;
    const cp2y = next.y - (afterNext.y - current.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  return `${path} Z`;
}

function createBubblePath(cx, cy, rx, ry, exponent, pointer, isActive, cellW, cellH) {
  const points = [];

  for (let i = 0; i < TOOL_BUBBLE_POINTS; i++) {
    const t = (i / TOOL_BUBBLE_POINTS) * Math.PI * 2;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    const xUnit = Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / exponent);
    const yUnit = Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / exponent);

    const x = cx + xUnit * rx;
    const y = cy + yUnit * ry;
    const distanceToPointer = Math.hypot(x - pointer.x, y - pointer.y);
    const influence = isActive ? Math.max(0, 1 - distanceToPointer / Math.max(cellW, cellH)) : 0;

    points.push({
      x: x + (pointer.x - cx) * influence * 0.05,
      y: y + (pointer.y - cy) * influence * 0.05
    });
  }

  return createClosedCurvePath(points);
}

function getToolBubbleTargetLines(width, height, activeIndex, pointer) {
  const cellW = width / TOOL_BUBBLE_COLS;
  const cellH = height / TOOL_BUBBLE_ROWS;
  const activeCol = activeIndex >= 0 ? activeIndex % TOOL_BUBBLE_COLS : null;
  const activeRow = activeIndex >= 0 ? Math.floor(activeIndex / TOOL_BUBBLE_COLS) : null;
  const pushX = cellW * 0.34;
  const pushY = cellH * 0.32;
  const activeCenterX = activeCol === null ? pointer.x : (activeCol + 0.5) * cellW;
  const activeCenterY = activeRow === null ? pointer.y : (activeRow + 0.5) * cellH;
  const localX = activeCol === null ? 0 : Math.max(-1, Math.min(1, (pointer.x - activeCenterX) / (cellW * 0.5)));
  const localY = activeRow === null ? 0 : Math.max(-1, Math.min(1, (pointer.y - activeCenterY) / (cellH * 0.5)));
  const pullX = localX * cellW * 0.06;
  const pullY = localY * cellH * 0.05;
  const vLines = [];
  const hLines = [];

  for (let i = 0; i <= TOOL_BUBBLE_COLS; i++) {
    let pos = i * cellW;

    if (activeCol !== null) {
      if (i <= activeCol) {
        const decay = i === 0 ? 0 : Math.pow(0.55, activeCol - i);
        pos -= pushX * decay;
      } else {
        const decay = i === TOOL_BUBBLE_COLS ? 0 : Math.pow(0.55, i - (activeCol + 1));
        pos += pushX * decay;
      }
    }

    if (i > 0 && i < TOOL_BUBBLE_COLS) {
      const distanceFromPointer = Math.abs(i * cellW - pointer.x) / cellW;
      pos += pullX * Math.max(0, 1 - distanceFromPointer * 0.72);
    }

    vLines.push(pos);
  }

  for (let i = 0; i <= TOOL_BUBBLE_ROWS; i++) {
    let pos = i * cellH;

    if (activeRow !== null) {
      if (i <= activeRow) {
        const decay = i === 0 ? 0 : Math.pow(0.60, activeRow - i);
        pos -= pushY * decay;
      } else {
        const decay = i === TOOL_BUBBLE_ROWS ? 0 : Math.pow(0.60, i - (activeRow + 1));
        pos += pushY * decay;
      }
    }

    if (i > 0 && i < TOOL_BUBBLE_ROWS) {
      const distanceFromPointer = Math.abs(i * cellH - pointer.y) / cellH;
      pos += pullY * Math.max(0, 1 - distanceFromPointer * 0.72);
    }

    hLines.push(pos);
  }

  return { vLines, hLines };
}

function moveLinesToward(current, target, amount) {
  if (!current || current.length !== target.length) {
    return target.slice();
  }

  return current.map((value, index) => value + (target[index] - value) * amount);
}

function linesAreSettled(current, target) {
  if (!current || current.length !== target.length) return false;

  return current.every((value, index) => Math.abs(value - target[index]) <= TOOL_BUBBLE_SETTLE_DISTANCE);
}

function computeToolBubbleLayout(width, height, vLines, hLines, activeIndex, pointer) {
  const cellW = width / TOOL_BUBBLE_COLS;
  const cellH = height / TOOL_BUBBLE_ROWS;

  return TOOL_BUBBLE_APPS.map((item, index) => {
    const col = index % TOOL_BUBBLE_COLS;
    const row = Math.floor(index / TOOL_BUBBLE_COLS);
    const gap = 3;
    const left = vLines[col] + gap;
    const right = vLines[col + 1] - gap;
    const top = hLines[row] + gap;
    const bottom = hLines[row + 1] - gap;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    const rx = Math.max(12, (right - left) / 2);
    const ry = Math.max(12, (bottom - top) / 2);
    const isActive = index === activeIndex;
    const isCompact = activeIndex >= 0 && !isActive;
    const pushLeft = vLines[col] - col * cellW;
    const pushRight = (col + 1) * cellW - vLines[col + 1];
    const pushTop = hLines[row] - row * cellH;
    const pushBottom = (row + 1) * cellH - hLines[row + 1];
    const pressure = Math.max(0, pushLeft / cellW)
      + Math.max(0, pushRight / cellW)
      + Math.max(0, pushTop / cellH)
      + Math.max(0, pushBottom / cellH);

    return {
      ...item,
      cx,
      cy,
      width: rx * 2,
      height: ry * 2,
      path: createBubblePath(
        cx,
        cy,
        rx,
        ry,
        3.8 + Math.min(3.0, pressure * 4.0),
        pointer,
        isActive,
        cellW,
        cellH
      ),
      isActive,
      isCompact
    };
  });
}

function initToolBubbles() {
  if (!toolBubbleStage || !toolBubbleSvg || !toolBubbleLinks) return;

  let activeIndex = -1;
  let width = 0;
  let height = 0;
  let currentVLines = null;
  let currentHLines = null;
  let frameId = null;
  let pointer = { x: 0, y: 0 };
  let targetPointer = { x: 0, y: 0 };

  const paths = TOOL_BUBBLE_APPS.map(() => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'tool-bubble-cell');
    toolBubbleSvg.appendChild(path);
    return path;
  });

  const links = TOOL_BUBBLE_APPS.map((app, index) => {
    const link = document.createElement('a');
    link.className = 'tool-bubble-link';
    link.href = app.url;
    link.title = app.label;
    link.dataset.index = String(index);
    link.innerHTML = `
      <span class="tool-bubble-icon-wrap">
        ${getToolBubbleIcon(app.icon)}
      </span>
      <span class="tool-bubble-label">${app.label}</span>
    `;
    toolBubbleLinks.appendChild(link);
    return link;
  });

  const syncSize = () => {
    width = toolBubbleStage.clientWidth;
    height = toolBubbleStage.clientHeight;

    if (width > 0 && height > 0) {
      toolBubbleSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      currentVLines = null;
      currentHLines = null;
      pointer = { x: width / 2, y: height / 2 };
      targetPointer = { x: width / 2, y: height / 2 };
      requestDraw();
    }
  };

  const drawFrame = () => {
    frameId = null;

    if (width <= 0 || height <= 0) {
      syncSize();
    }

    if (width <= 0 || height <= 0) {
      requestDraw();
      return;
    }

    pointer = {
      x: pointer.x + (targetPointer.x - pointer.x) * 0.24,
      y: pointer.y + (targetPointer.y - pointer.y) * 0.24
    };

    const target = getToolBubbleTargetLines(width, height, activeIndex, pointer);
    currentVLines = moveLinesToward(currentVLines, target.vLines, TOOL_BUBBLE_EASE);
    currentHLines = moveLinesToward(currentHLines, target.hLines, TOOL_BUBBLE_EASE);

    const bubbles = computeToolBubbleLayout(width, height, currentVLines, currentHLines, activeIndex, pointer);

    bubbles.forEach((bubble, index) => {
      const path = paths[index];
      const link = links[index];

      path.setAttribute('d', bubble.path);
      path.setAttribute('fill', bubble.isActive ? 'rgba(32, 207, 245, 0.72)' : 'rgba(247, 251, 255, 0.86)');
      path.setAttribute('stroke', 'rgba(5, 5, 7, 0.92)');
      path.setAttribute('stroke-width', bubble.isActive ? '2.2' : '1.4');

      link.classList.toggle('is-active', bubble.isActive);
      link.classList.toggle('is-compact', bubble.isCompact);
      link.style.width = `${bubble.width}px`;
      link.style.height = `${bubble.height}px`;
      link.style.transform = `translate3d(${bubble.cx - bubble.width / 2}px, ${bubble.cy - bubble.height / 2}px, 0)`;
    });

    const pointerSettled = Math.abs(pointer.x - targetPointer.x) <= TOOL_BUBBLE_SETTLE_DISTANCE
      && Math.abs(pointer.y - targetPointer.y) <= TOOL_BUBBLE_SETTLE_DISTANCE;
    const linesSettled = linesAreSettled(currentVLines, target.vLines) && linesAreSettled(currentHLines, target.hLines);

    if (!pointerSettled || !linesSettled) {
      requestDraw();
    }
  };

  function requestDraw() {
    if (frameId === null) {
      frameId = requestAnimationFrame(drawFrame);
    }
  };

  const setActiveIndex = (nextIndex) => {
    if (activeIndex === nextIndex) return;
    activeIndex = nextIndex;
    requestDraw();
  };

  toolBubbleStage.addEventListener('pointermove', (event) => {
    const rect = toolBubbleStage.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const col = Math.min(TOOL_BUBBLE_COLS - 1, Math.max(0, Math.floor((x / rect.width) * TOOL_BUBBLE_COLS)));
    const row = Math.min(TOOL_BUBBLE_ROWS - 1, Math.max(0, Math.floor((y / rect.height) * TOOL_BUBBLE_ROWS)));

    targetPointer = { x, y };
    setActiveIndex(Math.min(TOOL_BUBBLE_APPS.length - 1, row * TOOL_BUBBLE_COLS + col));
    requestDraw();
  });

  toolBubbleStage.addEventListener('pointerleave', () => {
    targetPointer = { x: width / 2, y: height / 2 };
    setActiveIndex(-1);
    requestDraw();
  });

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(syncSize);
    observer.observe(toolBubbleStage);
  } else {
    window.addEventListener('resize', syncSize);
  }

  syncSize();
  requestDraw();
}

if (btnSave) {
  btnSave.addEventListener('click', saveShortcut);
}

if (btnCancel) {
  btnCancel.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

if (inputUrl) {
  inputUrl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveShortcut();
    }
  });
}

if (inputName) {
  inputName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputUrl) inputUrl.focus();
    }
  });
}

/* =========================
   搜索引擎按钮
========================= */
function setupSearchEngine(id, baseUrl) {
  const btn = document.getElementById(id);
  if (!btn || !searchInput) return;

  btn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;

    window.location.href = baseUrl + encodeURIComponent(query);
  });
}

setupSearchEngine('btn-bili', 'https://search.bilibili.com/all?keyword=');
setupSearchEngine('btn-github', 'https://github.com/search?q=');
setupSearchEngine('btn-yt', 'https://www.youtube.com/results?search_query=');

/* =========================
   Google 搜索建议
========================= */
function hideSuggestions() {
  if (suggestionsList) suggestionsList.style.display = 'none';
  document.body.classList.remove('search-active');
}

function showSuggestions() {
  if (suggestionsList) suggestionsList.style.display = 'block';
  document.body.classList.add('search-active');
}

function renderSuggestions(suggestions) {
  if (!suggestionsList || !searchForm || !searchInput) return;

  suggestionsList.innerHTML = '';

  if (!suggestions || suggestions.length === 0) {
    hideSuggestions();
    return;
  }

  suggestions.slice(0, 6).forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;

    li.addEventListener('click', () => {
      searchInput.value = text;
      searchForm.submit();
    });

    suggestionsList.appendChild(li);
  });

  showSuggestions();
}

let suggestionRequestId = 0;
let suggestionAbortController = null;
let suggestionDebounceTimer = null;

function fetchSearchSuggestions(query) {
  suggestionRequestId++;
  const requestId = suggestionRequestId;

  if (suggestionAbortController) {
    suggestionAbortController.abort();
  }

  suggestionAbortController = new AbortController();

  fetch(
    `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`,
    { signal: suggestionAbortController.signal }
  )
    .then((res) => res.json())
    .then((data) => {
      if (requestId !== suggestionRequestId) return;

      const suggestions = Array.isArray(data) ? data[1] : [];
      renderSuggestions(suggestions);
    })
    .catch((err) => {
      if (err.name === 'AbortError') return;
      if (requestId !== suggestionRequestId) return;

      console.log(err);
      hideSuggestions();
    });
}

if (searchInput && suggestionsList) {
  searchInput.addEventListener('input', function () {
    const query = this.value.trim();
    clearTimeout(suggestionDebounceTimer);

    if (!query) {
      suggestionRequestId++;
      if (suggestionAbortController) {
        suggestionAbortController.abort();
      }
      hideSuggestions();
      return;
    }

    suggestionDebounceTimer = setTimeout(() => {
      fetchSearchSuggestions(query);
    }, 180);
  });
}

if (searchForm && suggestionsList) {
  document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) {
      hideSuggestions();
    }
  });
}

/* =========================
   实时年龄
   出生时间：2007-09-24 17:00 上海时间（UTC+8）
   对应 UTC：2007-09-24T09:00:00.000Z
========================= */
const BIRTH_DATE_UTC = new Date('2007-09-24T09:00:00.000Z');
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

function updateGreetingAge() {
  if (greetingTitle) {
    greetingTitle.textContent = 'Hi Giaok...';
  }

  if (!greetingAge) return;

  const now = new Date();
  const ageYears = (now - BIRTH_DATE_UTC) / MS_PER_YEAR;

  greetingAge.textContent = `Right now you are ${ageYears.toFixed(6)} years old!`;
}

/* =========================
   Calendar
========================= */
const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let calendarCursor = new Date();
let selectedCalendarDate = new Date();

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameCalendarWeek(a, b) {
  const start = new Date(b.getFullYear(), b.getMonth(), b.getDate() - b.getDay());
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  const date = new Date(a.getFullYear(), a.getMonth(), a.getDate());

  return date >= start && date <= end;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createCalendarCell(text, className = '', dateObj = null) {
  const cell = document.createElement('div');
  cell.className = `calendar-cell ${className}`.trim();
  cell.textContent = text;

  if (dateObj) {
    cell.dataset.date = getDateKey(dateObj);
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.addEventListener('click', () => {
      selectedCalendarDate = dateObj;
      renderCalendar();
    });
    cell.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectedCalendarDate = dateObj;
        renderCalendar();
      }
    });
  }

  return cell;
}

function renderCalendar() {
  if (!calendarGrid || !calendarTitle) return;

  const today = new Date();
  const anchorWeekStart = new Date(
    calendarCursor.getFullYear(),
    calendarCursor.getMonth(),
    calendarCursor.getDate() - calendarCursor.getDay()
  );
  const startDate = new Date(
    anchorWeekStart.getFullYear(),
    anchorWeekStart.getMonth(),
    anchorWeekStart.getDate() - 7
  );
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 20
  );

  const startLabel = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  calendarTitle.textContent = `${startLabel} - ${endLabel}`;

  if (calendarSubtitle) {
    calendarSubtitle.textContent = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  calendarGrid.innerHTML = '';

  WEEKDAY_LABELS.forEach((label) => {
    calendarGrid.appendChild(createCalendarCell(label, 'weekday'));
  });

  for (let index = 0; index < 21; index++) {
    const dateObj = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + index
    );
    const classes = ['day', 'three-week-view'];

    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
      classes.push('weekend');
    }

    if (isSameDate(dateObj, today)) {
      classes.push('today');
    }

    if (isSameCalendarWeek(dateObj, today)) {
      classes.push('current-week');
    }

    if (isSameDate(dateObj, selectedCalendarDate)) {
      classes.push('selected');
    }

    if (dateObj.getMonth() !== today.getMonth()) {
      classes.push('muted');
    }

    calendarGrid.appendChild(createCalendarCell(dateObj.getDate(), classes.join(' '), dateObj));
  }
}

if (calendarPrev) {
  calendarPrev.addEventListener('click', () => {
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth(),
      calendarCursor.getDate() - 7
    );
    renderCalendar();
  });
}

if (calendarNext) {
  calendarNext.addEventListener('click', () => {
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth(),
      calendarCursor.getDate() + 7
    );
    renderCalendar();
  });
}

/* =========================
   Daily command
========================= */
function updateDailyCommand() {
  if (!dailyToday) return;

  dailyToday.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/* =========================
   Command vault
========================= */
const COMMAND_VAULT = [
  {
    category: 'C / C++',
    commands: [
      ['Compile C', 'gcc main.c -o main', 'Build one C source into an executable.'],
      ['Compile C++', 'g++ main.cpp -o main', 'Build one C++ source into an executable.'],
      ['C11 warnings', 'gcc main.c -std=c11 -Wall -Wextra -o main', 'Use C11 and enable common warnings.'],
      ['C++20 warnings', 'g++ main.cpp -std=c++20 -Wall -Wextra -o main', 'Use modern C++ with warnings.'],
      ['Debug build', 'gcc main.c -g -O0 -o main', 'Generate debug info and disable optimization.'],
      ['Debug-friendly opt', 'gcc main.c -Og -g -o main', 'Optimize lightly while keeping debug useful.'],
      ['Assembly output', 'gcc main.c -S -o main.s', 'Stop after generating assembly.'],
      ['Preprocess only', 'gcc main.c -E -o main.i', 'Expand includes and macros only.'],
      ['Object file', 'gcc main.c -c -o main.o', 'Compile without linking.'],
      ['Multi-file app', 'gcc main.c list.c tree.c -o app', 'Compile several source files together.'],
      ['Include path', 'gcc src/main.c -Iinclude -o main', 'Add include/ to header search paths.'],
      ['Math library', 'gcc main.c -lm -o main', 'Link libm for math functions.'],
      ['ASan', 'gcc main.c -fsanitize=address -g -O1 -o main', 'Catch memory bugs like overflow and use-after-free.'],
      ['UBSan', 'gcc main.c -fsanitize=undefined -g -o main', 'Catch undefined behavior at runtime.'],
      ['Run after build', 'gcc main.c -o main && ./main', 'Build, then run only if compile succeeds.']
    ]
  },
  {
    category: 'CMake',
    commands: [
      ['Configure', 'cmake -S . -B build', 'Configure project into build/.'],
      ['Build', 'cmake --build build', 'Build using the configured generator.'],
      ['Debug', 'cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug', 'Configure a debug build.'],
      ['Release', 'cmake -S . -B build -DCMAKE_BUILD_TYPE=Release', 'Configure an optimized release build.'],
      ['RelWithDebInfo', 'cmake -S . -B build -DCMAKE_BUILD_TYPE=RelWithDebInfo', 'Release build with symbols.'],
      ['Ninja', 'cmake -S . -B build -G Ninja', 'Use Ninja generator.'],
      ['GCC compiler', 'cmake -S . -B build -DCMAKE_C_COMPILER=gcc -DCMAKE_CXX_COMPILER=g++', 'Select GCC and G++.'],
      ['Clang compiler', 'cmake -S . -B build -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++', 'Select Clang compilers.'],
      ['Fresh configure', 'cmake --fresh -S . -B build', 'Clear CMake cache and reconfigure.'],
      ['Target', 'cmake --build build --target my_target', 'Build one target only.'],
      ['Parallel build', 'cmake --build build -j 8', 'Build with 8 jobs.'],
      ['Windows config', 'cmake --build build --config Release', 'Build Release for multi-config generators.'],
      ['Install', 'cmake --install build --prefix ./install', 'Install into ./install.'],
      ['CTest', 'ctest --test-dir build --output-on-failure', 'Run tests and show failures.']
    ]
  },
  {
    category: 'Python',
    commands: [
      ['Version', 'python --version', 'Show Python version.'],
      ['Run file', 'python main.py', 'Run a Python script.'],
      ['Module run', 'python -m http.server 8000', 'Run a module, here a static server.'],
      ['Install pkg', 'python -m pip install numpy', 'Install into the current Python environment.'],
      ['Upgrade pip', 'python -m pip install --upgrade pip', 'Upgrade pip for current Python.'],
      ['List packages', 'python -m pip list', 'Show installed packages.'],
      ['Show package', 'python -m pip show torch', 'Inspect one installed package.'],
      ['Freeze reqs', 'python -m pip freeze > requirements.txt', 'Export installed versions.'],
      ['Install reqs', 'python -m pip install -r requirements.txt', 'Install from requirements.txt.'],
      ['Create venv', 'python -m venv .venv', 'Create a local virtual environment.'],
      ['Activate PS', '.\\.venv\\Scripts\\Activate.ps1', 'Activate venv in PowerShell.'],
      ['Activate bash', 'source .venv/bin/activate', 'Activate venv on Linux/macOS.'],
      ['Black', 'python -m black .', 'Format Python files.'],
      ['Ruff fix', 'python -m ruff check . --fix', 'Lint and auto-fix.']
    ]
  },
  {
    category: 'Conda',
    commands: [
      ['Version', 'conda --version', 'Show conda version.'],
      ['Env list', 'conda env list', 'List conda environments.'],
      ['Create env', 'conda create -n myenv python=3.11', 'Create env with Python 3.11.'],
      ['Activate', 'conda activate myenv', 'Enter a conda environment.'],
      ['Deactivate', 'conda deactivate', 'Leave current environment.'],
      ['Install', 'conda install numpy pandas matplotlib', 'Install packages.'],
      ['PyTorch CUDA', 'conda install pytorch torchvision torchaudio pytorch-cuda=12.8 -c pytorch -c nvidia', 'Install PyTorch with NVIDIA CUDA channel.'],
      ['List packages', 'conda list', 'Show packages in current env.'],
      ['Remove env', 'conda remove -n myenv --all', 'Delete a whole environment.'],
      ['Export yml', 'conda env export --from-history > environment.yml', 'Export manually requested packages.'],
      ['Create from yml', 'conda env create -f environment.yml', 'Create env from yml file.'],
      ['Update yml', 'conda env update -f environment.yml --prune', 'Sync env and remove extras.'],
      ['Clean', 'conda clean --all', 'Clean package caches.'],
      ['No base auto', 'conda config --set auto_activate_base false', 'Stop auto-activating base.']
    ]
  },
  {
    category: 'PowerShell',
    commands: [
      ['Location', 'Get-Location', 'Print current directory.'],
      ['List hidden', 'Get-ChildItem -Force', 'List files including hidden.'],
      ['Make dir', 'New-Item -ItemType Directory folder', 'Create a folder.'],
      ['Remove dir', 'Remove-Item folder -Recurse -Force', 'Delete folder recursively.'],
      ['Read file', 'Get-Content file.txt', 'Print file content.'],
      ['Find text', 'Select-String -Path file.txt -Pattern "hello"', 'Search text in a file.'],
      ['Find recursive', 'Get-ChildItem -Recurse *.c | Select-String -Pattern "malloc"', 'Search C files recursively.'],
      ['Process', 'Get-Process chrome', 'Find Chrome processes.'],
      ['Kill by PID', 'Stop-Process -Id 1234', 'Stop a process by id.'],
      ['Env temp', '$env:PORT="3000"', 'Set env var for this shell.'],
      ['Policy', 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', 'Allow local scripts for current user.']
    ]
  },
  {
    category: 'WSL',
    commands: [
      ['Enter', 'wsl', 'Open default WSL distro.'],
      ['Ubuntu', 'wsl -d Ubuntu', 'Open a specific distro.'],
      ['List', 'wsl -l -v', 'List distros with state/version.'],
      ['Shutdown', 'wsl --shutdown', 'Stop all WSL distros.'],
      ['Terminate', 'wsl -t Ubuntu', 'Stop one distro.'],
      ['Update', 'wsl --update', 'Update WSL.'],
      ['Status', 'wsl --status', 'Show WSL status.'],
      ['Default v2', 'wsl --set-default-version 2', 'Use WSL2 by default.'],
      ['Default distro', 'wsl --set-default Ubuntu', 'Set default distro.'],
      ['C drive', 'cd /mnt/c/Users/billy', 'Access Windows files from WSL.'],
      ['Explorer', 'explorer.exe .', 'Open current WSL path in Explorer.'],
      ['VS Code', 'code .', 'Open current folder in VS Code.']
    ]
  },
  {
    category: 'CUDA',
    commands: [
      ['GPU status', 'nvidia-smi', 'Show GPU, driver, VRAM, utilization.'],
      ['Watch GPU', 'nvidia-smi -l 1', 'Refresh every second.'],
      ['Query CSV', 'nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv', 'Show selected GPU fields.'],
      ['Process monitor', 'nvidia-smi pmon', 'Monitor GPU processes.'],
      ['NVCC version', 'nvcc --version', 'Show CUDA compiler version.'],
      ['Compile CUDA', 'nvcc main.cu -o main', 'Build a CUDA source file.'],
      ['CUDA arch', 'nvcc main.cu -o main -arch=sm_89', 'Compile for a specific GPU architecture.'],
      ['Torch CUDA', 'python -c "import torch; print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0))"', 'Quick PyTorch CUDA check.']
    ]
  },
  {
    category: 'Ollama',
    commands: [
      ['List', 'ollama list', 'Show local models.'],
      ['Pull', 'ollama pull gemma3:12b', 'Download a model.'],
      ['Run', 'ollama run gemma3:12b', 'Run a model interactively.'],
      ['Remove', 'ollama rm gemma3:12b', 'Delete a model.'],
      ['Running', 'ollama ps', 'Show loaded/running models.'],
      ['Show', 'ollama show gemma3:12b', 'Inspect model details.'],
      ['Serve', 'ollama serve', 'Start local Ollama API server.'],
      ['API tags', 'curl http://localhost:11434/api/tags', 'List models through API.']
    ]
  },
  {
    category: 'npm',
    commands: [
      ['Install', 'npm install', 'Install dependencies from package-lock.'],
      ['Dev', 'npm run dev', 'Start dev server.'],
      ['Build', 'npm run build', 'Create production build.'],
      ['Preview', 'npm run preview', 'Preview production build.'],
      ['Test', 'npm test', 'Run project tests.'],
      ['Audit', 'npm audit', 'Check dependency vulnerabilities.'],
      ['Fix audit', 'npm audit fix', 'Apply safe dependency fixes.'],
      ['Outdated', 'npm outdated', 'Show outdated packages.'],
      ['Clean install', 'npm ci', 'Install exactly from lockfile.'],
      ['Package info', 'npm view vite version', 'Check package metadata.']
    ]
  },
  {
    category: 'Git',
    commands: [
      ['Status', 'git status -s', 'Short working tree status.'],
      ['Add all', 'git add -A', 'Stage all changes.'],
      ['Commit', 'git commit -m "message"', 'Create a commit.'],
      ['Log graph', 'git log --oneline --graph --all', 'Compact branch history.'],
      ['Diff', 'git diff', 'Show unstaged changes.'],
      ['Diff staged', 'git diff --staged', 'Show staged changes.'],
      ['New branch', 'git switch -c new-feature', 'Create and switch branch.'],
      ['Pull rebase', 'git pull --rebase', 'Update current branch by rebasing.'],
      ['Push upstream', 'git push -u origin main', 'Push and set upstream.'],
      ['Unstage', 'git restore --staged file.txt', 'Remove file from stage.'],
      ['Stash', 'git stash', 'Temporarily save changes.'],
      ['Stash pop', 'git stash pop', 'Restore latest stash.'],
      ['Tag', 'git tag v1.0', 'Create a tag.']
    ]
  },
  {
    category: 'Linux',
    commands: [
      ['List', 'ls -lah', 'Long list, hidden files, human sizes.'],
      ['Make dirs', 'mkdir -p a/b/c', 'Create nested folders.'],
      ['Tail log', 'tail -f log.txt', 'Follow a changing log.'],
      ['Grep recursive', 'grep -rn "main" .', 'Search text with line numbers.'],
      ['Find Python', 'find . -type f -name "*.py"', 'Find Python files.'],
      ['Executable', 'chmod +x script.sh', 'Make script executable.'],
      ['Disk free', 'df -h', 'Show disk free space.'],
      ['Folder size', 'du -sh folder', 'Show folder size.'],
      ['Memory', 'free -h', 'Show memory usage.'],
      ['Port check', 'curl http://localhost:3000', 'Request local server.'],
      ['Tar create', 'tar -czf archive.tar.gz folder', 'Compress folder.'],
      ['Tar extract', 'tar -xzf archive.tar.gz', 'Extract tar.gz archive.']
    ]
  },
  {
    category: 'SSH',
    commands: [
      ['Connect', 'ssh user@host', 'Connect to server.'],
      ['Port', 'ssh user@host -p 2222', 'Connect on custom port.'],
      ['Keygen', 'ssh-keygen -t ed25519 -C "your_email@example.com"', 'Create SSH key.'],
      ['Show key', 'cat ~/.ssh/id_ed25519.pub', 'Print public key.'],
      ['Add key', 'ssh-add ~/.ssh/id_ed25519', 'Add key to agent.'],
      ['Copy up', 'scp file.txt user@host:/path/', 'Copy local file to server.'],
      ['Copy down', 'scp user@host:/path/file.txt .', 'Copy server file here.'],
      ['Tunnel', 'ssh -L 8888:localhost:8888 user@host', 'Forward remote Jupyter to local port.']
    ]
  },
  {
    category: 'VS Code',
    commands: [
      ['Open folder', 'code .', 'Open current folder.'],
      ['Open file', 'code main.c', 'Open one file.'],
      ['New window', 'code . -n', 'Open in a new window.'],
      ['Wait', 'code file.txt --wait', 'Block until file closes.'],
      ['Install ext', 'code --install-extension ms-python.python', 'Install an extension.'],
      ['List ext', 'code --list-extensions', 'List installed extensions.'],
      ['Uninstall ext', 'code --uninstall-extension ms-python.python', 'Remove an extension.']
    ]
  },
  {
    category: 'macOS',
    commands: [
      ['Finder', 'open .', 'Open current folder in Finder.'],
      ['Chrome', 'open -a "Google Chrome"', 'Open an app.'],
      ['Brew update', 'brew update && brew upgrade', 'Update Homebrew and packages.'],
      ['Brew install', 'brew install git', 'Install a package.'],
      ['Port use', 'lsof -i :3000', 'Find process using a port.'],
      ['System', 'sw_vers', 'Show macOS version.'],
      ['Hardware', 'system_profiler SPHardwareDataType', 'Show hardware overview.'],
      ['Screenshot', 'screencapture -i screenshot.png', 'Interactive screenshot.'],
      ['Clipboard in', 'pbcopy < file.txt', 'Copy file content to clipboard.'],
      ['Clipboard out', 'pbpaste', 'Print clipboard.']
    ]
  }
];

let activeCommandCategory = COMMAND_VAULT[0]?.category || '';

function createCommandButton(entry) {
  const [title, command, explanation] = entry;
  const button = document.createElement('button');
  button.className = 'command-item';
  button.type = 'button';
  button.dataset.copy = command;

  const name = document.createElement('span');
  name.className = 'command-name';
  name.textContent = title;

  const code = document.createElement('code');
  code.textContent = command;

  const note = document.createElement('small');
  note.textContent = explanation;

  button.append(name, code, note);
  return button;
}

function renderCommandVault() {
  if (!commandTabs || !commandList) return;

  commandTabs.innerHTML = '';
  commandList.innerHTML = '';

  COMMAND_VAULT.forEach((group) => {
    const tab = document.createElement('button');
    tab.className = 'command-tab';
    tab.type = 'button';
    tab.textContent = group.category;
    tab.dataset.category = group.category;
    tab.classList.toggle('is-active', group.category === activeCommandCategory);
    commandTabs.appendChild(tab);
  });

  const activeGroup = COMMAND_VAULT.find((group) => group.category === activeCommandCategory) || COMMAND_VAULT[0];
  activeGroup.commands.forEach((entry) => {
    commandList.appendChild(createCommandButton(entry));
  });
}

function selectCommandCategory(category) {
  if (!category || category === activeCommandCategory) return;

  activeCommandCategory = category;
  renderCommandVault();
}

function copyTextFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
  } finally {
    textarea.remove();
  }
}

function setCommandCopiedState(button) {
  button.classList.add('is-copied');
  window.setTimeout(() => {
    button.classList.remove('is-copied');
  }, 1200);
}

if (commandVault) {
  renderCommandVault();

  if (commandTabs) {
    let isDraggingTabs = false;
    let tabDragStartX = 0;
    let tabDragStartScroll = 0;
    let tabDragDistance = 0;
    let pendingTabCategory = '';

    commandTabs.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();
      commandTabs.scrollLeft += event.deltaY;
    }, { passive: false });

    commandTabs.addEventListener('pointerdown', (event) => {
      const tab = event.target.closest('.command-tab');

      isDraggingTabs = true;
      tabDragStartX = event.clientX;
      tabDragStartScroll = commandTabs.scrollLeft;
      tabDragDistance = 0;
      pendingTabCategory = tab?.dataset.category || '';
      commandTabs.classList.add('is-dragging');
      commandTabs.setPointerCapture(event.pointerId);
    });

    commandTabs.addEventListener('pointermove', (event) => {
      if (!isDraggingTabs) return;

      tabDragDistance = event.clientX - tabDragStartX;
      commandTabs.scrollLeft = tabDragStartScroll - tabDragDistance;
    });

    commandTabs.addEventListener('pointerup', (event) => {
      const wasTap = Math.abs(tabDragDistance) < 6;

      isDraggingTabs = false;
      commandTabs.classList.remove('is-dragging');
      commandTabs.releasePointerCapture(event.pointerId);

      if (pendingTabCategory && wasTap) {
        selectCommandCategory(pendingTabCategory);
      }

      pendingTabCategory = '';
    });

    commandTabs.addEventListener('pointercancel', () => {
      isDraggingTabs = false;
      pendingTabCategory = '';
      commandTabs.classList.remove('is-dragging');
    });

    commandTabs.addEventListener('click', (event) => {
      const tab = event.target.closest('.command-tab');
      if (!tab) return;

      event.stopPropagation();
      selectCommandCategory(tab.dataset.category);
    });
  }

  commandVault.addEventListener('click', (event) => {
    const button = event.target.closest('.command-item');
    if (!button) return;

    const text = button.dataset.copy;
    if (!text) return;

    const copyPromise = navigator.clipboard?.writeText
      ? navigator.clipboard.writeText(text)
      : Promise.resolve(copyTextFallback(text));

    copyPromise
      .then(() => setCommandCopiedState(button))
      .catch(() => {
        copyTextFallback(text);
        setCommandCopiedState(button);
      });
  });
}

/* =========================
   数字时钟
========================= */
function updateClock() {
  if (!clockText) return;

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  clockText.textContent = `${hh}:${mm}`;
}

/* =========================
   Bayern match panel
========================= */
const BAYERN_TEAM_ID = '132';
const BAYERN_DATA_URLS = [
  `https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/teams/${BAYERN_TEAM_ID}/schedule?fixture=true`,
  `https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/teams/${BAYERN_TEAM_ID}/schedule`,
  `https://site.web.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/teams/${BAYERN_TEAM_ID}/schedule`,
  `https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/teams/${BAYERN_TEAM_ID}/schedule?fixture=false`
];
const BAYERN_CACHE_KEY = 'p3r_bayern_match_cache_v3';
const BAYERN_CACHE_MS = 5 * 60 * 1000;
const BAYERN_SCOREBOARD_RANGE_DAYS = 14;

let bayernLoading = false;

function getBayernEvents(data) {
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.team?.events)) return data.team.events;
  if (Array.isArray(data?.schedule)) return data.schedule;
  return [];
}

function getEventCompetition(event) {
  return event.competitions?.[0] || event.competition || {};
}

function getEventStatus(event) {
  return getEventCompetition(event).status || event.status || {};
}

function getStatusType(event) {
  return getEventStatus(event).type || {};
}

function getEventCompetitors(event) {
  return getEventCompetition(event).competitors || event.competitors || [];
}

function isBayernCompetitor(competitor) {
  const team = competitor.team || competitor;
  const teamIds = [team.id, team.uid, competitor.id, competitor.uid]
    .filter(Boolean)
    .map(String);
  const teamNames = [
    team.displayName,
    team.shortDisplayName,
    team.name,
    competitor.displayName
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return teamIds.some((value) => value === BAYERN_TEAM_ID || value.endsWith(`:${BAYERN_TEAM_ID}`)) ||
    teamNames.some((value) => value.includes('bayern'));
}

function isBayernEvent(event) {
  return getEventCompetitors(event).some(isBayernCompetitor);
}

function getCompetitorName(competitor) {
  return competitor.team?.shortDisplayName ||
    competitor.team?.displayName ||
    competitor.team?.name ||
    competitor.displayName ||
    'TBD';
}

function getCompetitorLogo(competitor) {
  return competitor.team?.logo ||
    competitor.team?.logos?.[0]?.href ||
    competitor.logo ||
    '';
}

function getCompetitorScore(competitor) {
  if (competitor.score == null) return '-';
  if (typeof competitor.score === 'object') {
    return competitor.score.displayValue ?? competitor.score.value ?? '-';
  }
  return competitor.score;
}

function formatBayernDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Time TBD';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatEspnDateParam(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function getBayernDataUrls() {
  const from = new Date();
  const to = new Date();

  from.setDate(from.getDate() - BAYERN_SCOREBOARD_RANGE_DAYS);
  to.setDate(to.getDate() + BAYERN_SCOREBOARD_RANGE_DAYS);

  return [
    ...BAYERN_DATA_URLS,
    `https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard?dates=${formatEspnDateParam(from)}-${formatEspnDateParam(to)}`
  ];
}

function pickBayernMatch(events) {
  const now = Date.now();
  const sorted = events
    .filter((event) => event?.date)
    .map((event) => ({ event, time: new Date(event.date).getTime() }))
    .filter((item) => !Number.isNaN(item.time));

  const live = sorted.find(({ event }) => {
    const type = getStatusType(event);
    return type.state === 'in' || type.name === 'STATUS_IN_PROGRESS';
  });

  if (live) return { event: live.event, mode: 'Live' };

  const latestFinal = sorted
    .filter(({ event, time }) => {
      const type = getStatusType(event);
      return time <= now && (type.completed || type.state === 'post');
    })
    .sort((a, b) => b.time - a.time)[0];

  if (latestFinal) return { event: latestFinal.event, mode: 'Latest result' };

  const next = sorted
    .filter(({ time }) => time > now)
    .sort((a, b) => a.time - b.time)[0];

  if (next) return { event: next.event, mode: 'Next match' };

  return null;
}

function mergeBayernData(dataItems) {
  const eventsById = new Map();

  dataItems.forEach((data) => {
    getBayernEvents(data).filter(isBayernEvent).forEach((event) => {
      const id = event.id || event.uid || `${event.name}-${event.date}`;
      eventsById.set(id, event);
    });
  });

  return {
    events: Array.from(eventsById.values())
  };
}

function renderBayernMatch(match) {
  if (!bayernCompetition || !bayernHomeName || !bayernAwayName) return;

  if (!match) {
    bayernCompetition.textContent = 'FC Bayern Munich';
    bayernHomeName.textContent = 'Bayern';
    bayernAwayName.textContent = 'Match unavailable';
    bayernHomeScore.textContent = '-';
    bayernAwayScore.textContent = '-';
    if (bayernHomeLogo) bayernHomeLogo.removeAttribute('src');
    if (bayernAwayLogo) bayernAwayLogo.removeAttribute('src');
    if (bayernStatus) bayernStatus.textContent = 'vs';
    if (bayernDetail) bayernDetail.textContent = 'Could not find a recent or upcoming match.';
    return;
  }

  const { event, mode } = match;
  const competition = getEventCompetition(event);
  const competitors = getEventCompetitors(event);
  const home = competitors.find((item) => item.homeAway === 'home') || competitors[0] || {};
  const away = competitors.find((item) => item.homeAway === 'away') || competitors[1] || {};
  const statusType = getStatusType(event);
  const hasScore = statusType.state === 'in' || statusType.completed || statusType.state === 'post';

  bayernCompetition.textContent = event.league?.name || event.season?.displayName || 'FC Bayern Munich';
  bayernHomeName.textContent = getCompetitorName(home);
  bayernAwayName.textContent = getCompetitorName(away);
  bayernHomeScore.textContent = hasScore ? getCompetitorScore(home) : '-';
  bayernAwayScore.textContent = hasScore ? getCompetitorScore(away) : '-';
  if (bayernHomeLogo) {
    bayernHomeLogo.src = getCompetitorLogo(home);
    bayernHomeLogo.alt = `${getCompetitorName(home)} logo`;
  }
  if (bayernAwayLogo) {
    bayernAwayLogo.src = getCompetitorLogo(away);
    bayernAwayLogo.alt = `${getCompetitorName(away)} logo`;
  }
  bayernStatus.textContent = statusType.shortDetail || statusType.description || (hasScore ? 'FT' : 'vs');
  bayernDetail.textContent = `${event.name || 'Bayern match'} · ${formatBayernDate(event.date)}${competition.venue?.fullName ? ` · ${competition.venue.fullName}` : ''}`;
}

function readBayernCache(ignoreAge = false) {
  try {
    const cached = JSON.parse(localStorage.getItem(BAYERN_CACHE_KEY));
    if (!cached) return null;
    if (!ignoreAge && Date.now() - cached.createdAt > BAYERN_CACHE_MS) return null;
    return cached.data;
  } catch (err) {
    return null;
  }
}

function writeBayernCache(data) {
  localStorage.setItem(BAYERN_CACHE_KEY, JSON.stringify({
    createdAt: Date.now(),
    data
  }));
}

function renderBayernFromData(data) {
  renderBayernMatch(pickBayernMatch(getBayernEvents(data)));
}

function loadBayernMatch(forceRefresh = false) {
  if (bayernLoading) return;

  const cached = !forceRefresh ? readBayernCache() : null;
  if (cached) {
    renderBayernFromData(cached);
    return;
  }

  bayernLoading = true;
  if (bayernStatus) bayernStatus.textContent = 'Loading';

  Promise.allSettled(getBayernDataUrls().map((url) => (
    fetch(url).then((res) => {
      if (!res.ok) throw new Error(`Bayern data failed: ${res.status}`);
      return res.json();
    })
  )))
    .then((results) => {
      const data = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

      if (!data.length) throw new Error('All Bayern data requests failed');

      const mergedData = mergeBayernData(data);
      writeBayernCache(mergedData);
      renderBayernFromData(mergedData);
    })
    .catch((err) => {
      console.log(err);
      const fallback = readBayernCache(true);
      if (fallback) {
        renderBayernFromData(fallback);
        if (bayernStatus) bayernStatus.textContent = 'Cached';
      } else {
        renderBayernMatch(null);
      }
    })
    .finally(() => {
      bayernLoading = false;
    });
}

setInterval(() => {
  if (document.visibilityState === 'visible') {
    loadBayernMatch(true);
  }
}, 120000);

/* =========================
   初始化
========================= */
updateClock();
setInterval(updateClock, 30000);

updateGreetingAge();
setInterval(updateGreetingAge, 30000);

renderCalendar();
setInterval(renderCalendar, 60000);

updateDailyCommand();
setInterval(updateDailyCommand, 60000);

loadAndRenderShortcuts();
loadBayernMatch();
initToolBubbles();
/* =========================
   Live2D global mouse bridge
   Send whole-newtab pointer position to character iframe.
========================= */

const characterFrame = document.getElementById('character-frame');

let live2dMouseRaf = null;
let lastLive2dPointer = null;

function sendPointerToLive2D(pointer) {
  if (!characterFrame || !characterFrame.contentWindow) return;

  const viewportWidth = Math.max(1, window.innerWidth);
  const viewportHeight = Math.max(1, window.innerHeight);

  const xRatio = pointer.clientX / viewportWidth;
  const yRatio = pointer.clientY / viewportHeight;

  characterFrame.contentWindow.postMessage(
    {
      type: 'p3r-global-pointer',
      xRatio,
      yRatio,
      clientX: pointer.clientX,
      clientY: pointer.clientY,
      viewportWidth,
      viewportHeight
    },
    location.origin
  );
}

function queuePointerToLive2D(event) {
  lastLive2dPointer = {
    clientX: event.clientX,
    clientY: event.clientY
  };

  if (live2dMouseRaf) return;

  live2dMouseRaf = requestAnimationFrame(() => {
    live2dMouseRaf = null;

    if (lastLive2dPointer) {
      sendPointerToLive2D(lastLive2dPointer);
    }
  });
}

window.addEventListener('mousemove', queuePointerToLive2D, { passive: true });
window.addEventListener('pointermove', queuePointerToLive2D, { passive: true });

window.addEventListener(
  'mouseleave',
  () => {
    if (!characterFrame || !characterFrame.contentWindow) return;

    characterFrame.contentWindow.postMessage(
      {
        type: 'p3r-global-pointer-leave'
      },
      location.origin
    );
  },
  { passive: true }
);
