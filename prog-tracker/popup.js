$(function () {
    $('#saveProgBtn').click(function () {
        // Send a message to the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { msg: "save_scroll_pos" });
        });
    });

    $('#openPrTrBtn').click(function () {
        chrome.runtime.sendMessage({ msg: "open_prog_trkr" })
    });
});

(function () {
    chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        if (request.msg === "scroll_saved") {
            // Refresh reading list page
            chrome.tabs.query({ title: 'Reading Progress Tracker' }, (tabs) => {
                if (tabs.length > 0) { 
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        } 
    });
})()