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
  delBtn.innerHTML = '×';
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
  addBtn.innerHTML = '+';
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

if (searchInput && suggestionsList) {
  searchInput.addEventListener('input', function () {
    const query = this.value.trim();

    if (!query) {
      hideSuggestions();
      return;
    }

    fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const suggestions = Array.isArray(data) ? data[1] : [];
        renderSuggestions(suggestions);
      })
      .catch((err) => {
        console.log(err);
        hideSuggestions();
      });
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
calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), 1);

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function createCalendarCell(text, className = '') {
  const cell = document.createElement('div');
  cell.className = `calendar-cell ${className}`.trim();
  cell.textContent = text;
  return cell;
}

function renderCalendar() {
  if (!calendarGrid || !calendarTitle) return;

  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const today = new Date();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const firstWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  calendarTitle.textContent = `${MONTH_LABELS[month]} ${year}`;

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

  const totalDayCells = 42;
  let renderedDays = 0;

  for (let i = 0; i < firstWeekday; i++) {
    const dayNum = daysInPrevMonth - firstWeekday + i + 1;
    calendarGrid.appendChild(createCalendarCell(dayNum, 'day muted'));
    renderedDays++;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const classes = ['day', 'is-month-view'];

    if (isSameDate(dateObj, today)) {
      classes.push('today');
    }

    calendarGrid.appendChild(createCalendarCell(day, classes.join(' ')));
    renderedDays++;
  }

  for (let nextDay = 1; renderedDays < totalDayCells; nextDay++) {
    calendarGrid.appendChild(createCalendarCell(nextDay, 'day muted'));
    renderedDays++;
  }
}

if (calendarPrev) {
  calendarPrev.addEventListener('click', () => {
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth() - 1,
      1
    );
    renderCalendar();
  });
}

if (calendarNext) {
  calendarNext.addEventListener('click', () => {
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth() + 1,
      1
    );
    renderCalendar();
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
   初始化
========================= */
updateClock();
setInterval(updateClock, 30000);

updateGreetingAge();
setInterval(updateGreetingAge, 100);

renderCalendar();
setInterval(renderCalendar, 60000);

loadAndRenderShortcuts();