(function () {
    window.onload = () => {
        var scrolls = {};
        // Updates and populates the list
        var sitesList = document.getElementById('sitesList');
        const updateUrls = () => {
            chrome.storage.sync.get(null, (data) => {
                if (data) {
                    var keys = Object.keys(data).filter( (key) => key.startsWith('ProgTrkr_'))
                                                .sort( (k1, k2) => (new Date(data[k1].time) - new Date(data[k2].time)));
                    for (let key of keys) {
                        const url = key.substr('ProgTrkr_'.length);
                        var toInsertContainer = document.createElement('div');
                        toInsertContainer.innerHTML = getTemplate(data[key].title, 
                                                                url, 
                                                                data[key].time);
                        sitesList.insertBefore(toInsertContainer, sitesList.firstChild);
                        scrolls[url] = data[key].scroll;
                    }
                    
                    // Register mouse events
                    for (var child of sitesList.children) {
                        const lstElContainer = child.children[0].children[0];
                        const crossImg = child.getElementsByClassName('cross')[0];
                        
                        lstElContainer.addEventListener('mouseenter', (e) => {
                            crossImg.style.visibility = 'visible';
                        });
                        lstElContainer.addEventListener('mouseleave', (e) => {
                            crossImg.style.visibility = 'hidden';
                        });
                        crossImg.onclick = () => {
                            const hrefEl = child.getElementsByTagName('a')[0];
                            const url = hrefEl.getAttribute('href');
                            const key = 'ProgTrkr_' + url;
                            chrome.storage.sync.remove(key, () => { });
                            sitesList.removeChild(child);
                        };
                    }
                }
            });
        };

        // Returns the full time string
        const getTimeString = (time) => {
            const minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
            return `${time.toDateString()} @ ${time.getHours()}:${minutes}`
        };
        
        // Returns a list entry template
        const getTemplate = (title, url, time) => {
            var t = new Date(time);
            var urlDomain = extractDomain(url);
            return `
            <div style="display: flex; flex-direction: column; word-break: break-all; padding: 0.5%; position: relative; font-size: 1.2em;">
                <div style="width: 50%">
                    <img class="cross" src="images/cross.png" 
                        style="visibility: hidden; width: 1rem; vertical-align: middle; cursor: pointer;">
                    <img src="https://www.google.com/s2/favicons?domain=${urlDomain}" 
                        style="left: 25px; width: 1.3em; height: 1.3em; vertical-align: middle;">
                    <a href="${url}" target="_blank" style="padding-left: .25em; padding-right: 1em; text-decoration: none; cursor: pointer; color: #234da7;">
                        <b>${urlDomain.replace('www.', '').split('/')[0].toUpperCase()}</b> ${title}&nbsp
                    </a>
                </div>
                <span style="padding-left: 4em; color: #a0a0b5; font-size: 12px"> · ${getTimeString(t)} · ${getTimeAgo(new Date() - t)} ·</span>
            </div>`;
        };

        // Returns time ago formatted as '<days>d <hours>h <minutes>m ago'
        const getTimeAgo = (milis) => {
            const days = Math.floor(milis / (3600000 * 24));
            const hours = Math.floor(milis / 3600000) % 24;
            const mins = Math.round(milis / 60000) % 60;
            return `${days}d ${hours}h ${mins}m ago`;
        };

        // Get domain from URL
        const extractDomain = (url) => {
            var dmn;
            // Find & remove protocol
            dmn = (url.indexOf("//") > -1) ? url.split('/')[2] : dmn = url.split('/')[0];
            // Find & remove port number
            dmn = dmn.split(':')[0];
            // Find & remove "?"
            dmn = dmn.split('?')[0];
            return dmn;
        };

        // Clear button click handler
        var clearBtn = document.getElementById('clearBtn');
        clearBtn.onclick = () => {
            // Verify with user
            if (confirm("Are you sure you want to clear your reading list?\n* All progress will be deleted !! *")) {
                // User confirmed
                chrome.storage.sync.get(null, (data) => {
                    if (data) {
                        for (let key of Object.keys(data)) {
                            if (key.startsWith('ProgTrkr_')) {
                                chrome.storage.sync.remove(key, () => { });
                            }
                        }
                        // Refresh reading list page
                        chrome.tabs.query({ title: 'Reading Progress Tracker' }, (tabs) => {
                            if (tabs.length > 0) { 
                                chrome.tabs.reload(tabs[0].id);
                            }
                        });
                    }
                });
            }
        };

        // Set timer to refresh the list periodically (to update time ago)
        setInterval(() => {
            while (sitesList.firstChild) {
                sitesList.removeChild(sitesList.firstChild);
            }
            updateUrls();
        }, 60000);

        // Populate list at page open
        updateUrls();

        // Listen for scroll request message
        chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
            if (request.msg === "prog_trkr_rqst_scroll") {
                sendResponse({ scroll_y: scrolls[sender.url] });
                // chrome.runtime.sendMessage({ msg: "prog_trkr_scrollTo:" + scrolls[sender.url] });
            }
        });
    };
})();