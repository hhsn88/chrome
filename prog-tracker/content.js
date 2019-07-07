chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if( request.msg === "save_scroll_pos" ) {
        chrome.storage.sync.get(null, (data) => {  
            if (data) { 
                // Remove '?prg_trkr=' if present
                const idx = document.URL.indexOf('?prg_trkr=');
                var url = idx > 0 ? document.URL.substring(0, idx) : document.URL;
                // Remove '#' if present
                url = url.split('#')[0];
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
});

(function () {
    const idx = document.URL.indexOf('?prg_trkr=');
    if (idx >= 0) {
        const scroll_y = parseInt(document.URL.substr(idx + '?prg_trkr='.length));
        if (scroll_y) {
            window.scrollTo(window.scrollX, scroll_y)
        }
    }
})()