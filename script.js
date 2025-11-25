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

// 默认数据
const DEFAULT_SHORTCUTS = [
    { name: 'Spotify', url: 'https://open.spotify.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png' },
    { name: 'Discord', url: 'https://discord.com/channels/@me', icon: 'https://www.google.com/s2/favicons?sz=128&domain=discord.com' },
    { name: 'Instagram', url: 'https://www.instagram.com', icon: 'https://www.google.com/s2/favicons?sz=256&domain=instagram.com' },
    { name: 'LeetCode', url: 'https://leetcode.com/problemset/', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' }
];

// --- 菜单逻辑 ---
menuBtn.addEventListener('click', (e) => { e.stopPropagation(); appsGrid.classList.toggle('active'); });
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !appsGrid.contains(e.target)) appsGrid.classList.remove('active');
});

// --- 快捷键管理逻辑 ---

function loadAndRenderShortcuts() {
    let shortcuts = JSON.parse(localStorage.getItem('p3r_shortcuts'));
    if (!shortcuts || shortcuts.length === 0) {
        shortcuts = DEFAULT_SHORTCUTS;
        localStorage.setItem('p3r_shortcuts', JSON.stringify(shortcuts));
    }

    shortcutsContainer.innerHTML = '';

    shortcuts.forEach((item, index) => {
        // 创建链接容器
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'shortcut-item';
        a.target = '_blank';
        a.title = item.name;

        // 图标
        const img = document.createElement('img');
        img.src = item.icon;

        // [新] 删除按钮
        const delBtn = document.createElement('div');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '×';
        delBtn.title = 'Remove';

        // 点击删除时的逻辑
        delBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止跳转
            e.stopPropagation(); // 阻止冒泡
            removeShortcut(index);
        });

        a.appendChild(img);
        a.appendChild(delBtn);
        shortcutsContainer.appendChild(a);
    });

    // (+) 按钮
    const addBtn = document.createElement('div');
    addBtn.className = 'shortcut-item add-shortcut-btn';
    addBtn.innerHTML = '+';
    addBtn.addEventListener('click', openModal);
    shortcutsContainer.appendChild(addBtn);
}

// 删除单个快捷键
function removeShortcut(index) {
    let shortcuts = JSON.parse(localStorage.getItem('p3r_shortcuts')) || [];
    shortcuts.splice(index, 1); // 删除指定索引
    localStorage.setItem('p3r_shortcuts', JSON.stringify(shortcuts));
    loadAndRenderShortcuts(); // 重新渲染
}

function openModal() { modal.style.display = 'flex'; inputName.value = ''; inputUrl.value = ''; inputName.focus(); }
function closeModal() { modal.style.display = 'none'; }

function saveShortcut() {
    const name = inputName.value.trim();
    let url = inputUrl.value.trim();
    if (!name || !url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    let domain = url;
    try { domain = new URL(url).hostname; } catch (e) {}

    // 使用 Google Favicon API
    const iconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

    const shortcuts = JSON.parse(localStorage.getItem('p3r_shortcuts')) || [];
    shortcuts.push({ name: name, url: url, icon: iconUrl });
    localStorage.setItem('p3r_shortcuts', JSON.stringify(shortcuts));
    closeModal();
    loadAndRenderShortcuts();
}

btnSave.addEventListener('click', saveShortcut);
btnCancel.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

loadAndRenderShortcuts();

// --- 搜索引擎 ---
function setupSearchEngine(id, baseUrl) {
    const btn = document.getElementById(id);
    if(btn) btn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if(query) window.open(baseUrl + encodeURIComponent(query), '_blank');
    });
}
setupSearchEngine('btn-bili', 'https://search.bilibili.com/all?keyword=');
setupSearchEngine('btn-github', 'https://github.com/search?q=');
setupSearchEngine('btn-yt', 'https://www.youtube.com/results?search_query=');

// --- 搜索建议 ---
searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    if (!query) { suggestionsList.style.display = 'none'; document.body.classList.remove('search-active'); return; }

    fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`)
        .then(res => res.json())
        .then(data => {
            const suggestions = data[1];
            suggestionsList.innerHTML = '';
            if (suggestions && suggestions.length > 0) {
                suggestions.slice(0, 6).forEach(text => {
                    const li = document.createElement('li');
                    li.textContent = text;
                    li.addEventListener('click', () => { searchInput.value = text; searchForm.submit(); });
                    suggestionsList.appendChild(li);
                });
                suggestionsList.style.display = 'block';
                document.body.classList.add('search-active');
            } else {
                suggestionsList.style.display = 'none';
                document.body.classList.remove('search-active');
            }
        }).catch(err => console.log(err));
});

document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) { suggestionsList.style.display = 'none'; document.body.classList.remove('search-active'); }
});