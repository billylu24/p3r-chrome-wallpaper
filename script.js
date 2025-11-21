const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
const searchForm = document.querySelector('.search-form');

// 搜索 & 动画逻辑
searchInput.addEventListener('input', function() {
    const query = this.value.trim();

    if (!query) {
        suggestionsList.style.display = 'none';
        document.body.classList.remove('search-active');
        return;
    }

    fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`)
        .then(response => response.json())
        .then(data => {
            const suggestions = data[1];
            suggestionsList.innerHTML = '';

            if (suggestions && suggestions.length > 0) {
                suggestions.slice(0, 6).forEach(text => {
                    const li = document.createElement('li');
                    li.textContent = text;
                    li.addEventListener('click', () => {
                        searchInput.value = text;
                        searchForm.submit();
                    });
                    suggestionsList.appendChild(li);
                });

                // 显示列表并触发界面展开动画
                suggestionsList.style.display = 'block';
                document.body.classList.add('search-active');

            } else {
                suggestionsList.style.display = 'none';
                document.body.classList.remove('search-active');
            }
        })
        .catch(err => {
            console.log("Error fetching suggestions:", err);
        });
});

document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) {
        suggestionsList.style.display = 'none';
        document.body.classList.remove('search-active');
    }
});