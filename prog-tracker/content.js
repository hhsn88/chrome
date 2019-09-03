chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if( request.msg === "save_scroll_pos" ) {
        chrome.storage.sync.get(null, (data) => {  
            if (data) { 
                var url = document.URL.split('#')[0]; // Remove '#' if present
                // Create / Update entry
                data['ProgTrkr_' + url] = {
                    scroll: Math.trunc(window.scrollY),
                    title: document.title,
                    time: (new Date()).toString()
                };
                // Save entry to storage
                chrome.storage.sync.set(data, () => {
                    if (chrome.runtime.lastError) {
                        console.log(`Exception occured: ${chrome.runtime.lastError}`)
                    }
                }); 
                // Notify extension scripts about the update
                chrome.runtime.sendMessage({ msg: "scroll_saved"});
            }
        });
    }
    // Notify ReadingList that the page finished loading
    if( request.msg.startswith("prog_trkr_scrollTo:") ) {
        var scrollTo = parseeInt(request.msg.split(':')[1]);
        if (scrollTo) {
            window.scrollTo(window.scrollX, scrollTo);
        }
    }
});

(function () {
    chrome.runtime.sendMessage({ msg: "prog_trkr_rqst_scroll" }, (response) => {
        window.scrollTo(window.scrollX, response.scroll_y);
    });
})()