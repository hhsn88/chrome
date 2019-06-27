chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if (request.msg === "open_prog_trkr") {
        chrome.tabs.create({"url": "readingList.html"});
    }
});