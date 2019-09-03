(function () {
    window.onload = () => {
        const saveProgBtn = document.getElementById('saveProgBtn');
        saveProgBtn.onclick = () => {
            // Send a message to the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { msg: "save_scroll_pos" });
            });
        };
        
        const openPrTrBtn = document.getElementById('openPrTrBtn');
        openPrTrBtn.onclick = () => {
            chrome.runtime.sendMessage({ msg: "open_prog_trkr" });
        };
    };
    
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