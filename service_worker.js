const daysAgo = 366;
const maxResults = 99999999;
const minStartTime = new Date("2008-01-01").getTime();

// Event listener for clean action
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action == "clean") {
        chrome.storage.local.get(['keywords']).then((result) => {
            let keywords = result.keywords || [];
            fetchHistory(keywords).then((urls) => {
                let rows = urls.length;
                console.log("matched urls: ", rows);
                urls.forEach(url => {
                    console.log("deleting url: ", url);
                    chrome.history.deleteUrl({ url: url }, () => {
                        rows--;
                        if (rows == 0) {
                            sendResponse({ status: "ok" });
                        }
                    });
                });
            });
        });
    }
    // Return true to indicate that you want to send a response asynchronously
    return true;
});

// Function to search history in a time range by keyword
async function searchHistory(text, startTime, endTime) {
    return new Promise((resolve, reject) => {
        chrome.history.search({
            text: text,
            startTime: startTime,
            endTime: endTime,
            maxResults: maxResults
        }, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                let urls = items.map(item => item.url);
                resolve(urls);
            }
        });
    });
}

// Define the time range for each batch in milliseconds
const unit = 24 * 60 * 60 * 1000;
const interval = daysAgo * unit;

// Function to fetch history in batches
async function fetchHistory(keywords) {
    let urls = [];
    for (let kw of keywords) {
        let endTime = Date.now();
        let startTime = Math.max(endTime - interval, minStartTime);
        for (; endTime > minStartTime;) {
            let hitUrls = await searchHistory(kw, startTime, endTime);
            console.log(`matched ${hitUrls.length} urls for ${kw} in [${new Date(startTime).toLocaleString()}, ${new Date(endTime).toLocaleString()}]`);
            urls.push(...hitUrls);
            // Move to the next time range
            endTime = startTime;
            startTime = Math.max(endTime - interval, minStartTime);
        }
    }
    return urls;
}