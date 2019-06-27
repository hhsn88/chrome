chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if( request.msg === "save_scroll_pos" ) {
        chrome.storage.sync.get(null, (data) => {  
            if (data) { 
                data['ProgTrkr_' + document.URL] = {
                    scroll: Math.trunc(window.scrollY),
                    title: document.title,
                    time: (new Date()).toString()
                };
                
                chrome.storage.sync.set(data, () => {
                    if (chrome.runtime.lastError) {
                        console.log(`Exception occured: ${chrome.runtime.lastError}`)
                    }
                }); 
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