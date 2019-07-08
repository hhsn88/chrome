chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if (request.msg === "open_prog_trkr") {
        chrome.tabs.query({}, (tabs) => {
            // Check if already opened
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].url === 'chrome-extension://afccefgidedpplolmoneomagdckofajd/readingList.html') {
                    chrome.tabs.update(tabs[i].id, {active: true});
                    return;
                }
            }
            // Tab not opened -> open it
            chrome.tabs.create({"url": "readingList.html"});
        })
    }
});