const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
const searchForm = document.querySelector('.search-form');

// 1. 监听输入
searchInput.addEventListener('input', function() {
    const query = this.value.trim();

    // 如果输入为空，隐藏列表
    if (!query) {
        suggestionsList.style.display = 'none';
        return;
    }

    // 使用 fetch 请求 Google API
    // client=firefox 返回的是规范的 JSON 格式
    fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`)
        .then(response => response.json())
        .then(data => {
            // data[1] 是推荐词数组
            const suggestions = data[1];

            // 清空旧列表
            suggestionsList.innerHTML = '';

            if (suggestions && suggestions.length > 0) {
                // 限制显示前 6 个
                suggestions.slice(0, 6).forEach(text => {
                    const li = document.createElement('li');
                    li.textContent = text;
                    
                    // 点击某一项：填入并搜索
                    li.addEventListener('click', () => {
                        searchInput.value = text;
                        searchForm.submit();
                    });

                    suggestionsList.appendChild(li);
                });
                
                // 显示列表
                suggestionsList.style.display = 'block';
            } else {
                suggestionsList.style.display = 'none';
            }
        })
        .catch(err => {
            console.log("获取推荐失败，可能是网络问题", err);
        });
});

// 2. 点击空白处关闭列表
document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) {
        suggestionsList.style.display = 'none';
    }
});