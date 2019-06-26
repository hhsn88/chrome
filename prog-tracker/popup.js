$(function () {
    chrome.storage.sync.get('position', (data) => {
        $('#scrollPosition').text(data.position);
    });

    $('#saveProgBtn').click(function () {
        // Save current scroll position
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.executeScript(
                tabs[0].id,
                {
                    code: 'chrome.storage.sync.get("scrolls", (data) => {  \
                            var scrolls; \
                            if (data.scrolls) { \
                                scrolls = data.scrolls; \
                                const idx = scrolls.findIndex((v,i,arr) => Object.keys(v)[0] == document.URL); \
                                if (idx == -1) { \
                                    var obj = {}; \
                                    obj[document.URL] = {pos: Math.trunc(window.scrollY)}; \
                                    scrolls.push(obj); \
                                } else { \
                                    scrolls[idx].pos = window.scrollY; \
                                } \
                            } else { \
                                var obj = {}; \
                                obj[document.URL] = {pos: Math.trunc(window.scrollY)}; \
                                scrolls = [obj]; \
                            }\
                            chrome.storage.sync.set({scrolls}, () => {}); \
                        });'
                }
            );
        });
    });

    $('#xxx').click(function () {
        chrome.storage.sync.remove("scrolls", ()=>{});
    });
});