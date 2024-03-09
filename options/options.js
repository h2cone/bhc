
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['keywords']).then((result) => {
        let keywords = result.keywords || [];
        let keywordsDiv = document.getElementById('keywordsDiv');
        let keywordInput = document.getElementById('keywordInput');

        keywords.forEach(function (keyword) {
            addKeyword(keyword);
        });
        keywordInput.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter') {
                let keyword = keywordInput.value.trim();
                if (keyword && keywords.indexOf(keyword) === -1) {
                    keywords.push(keyword);
                    chrome.storage.local.set({ keywords: keywords });
                    addKeyword(keyword);
                    keywordInput.value = '';
                }
            }
        });
        function addKeyword(keyword) {
            let div = document.createElement('div');
            div.className = 'keyword';
            div.textContent = keyword;

            let deleteSpan = document.createElement('span');
            deleteSpan.className = 'delete';
            deleteSpan.textContent = 'x';
            deleteSpan.addEventListener('click', function () {
                let index = keywords.indexOf(keyword);
                if (index !== -1) {
                    keywords.splice(index, 1);
                    chrome.storage.local.set({ keywords: keywords });
                    keywordsDiv.removeChild(div);
                }
            });
            div.appendChild(deleteSpan);
            keywordsDiv.appendChild(div);
        }
    });
});
