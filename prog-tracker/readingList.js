$(function () {
    // Updates and populates the list
    const updateUrls = () => {
        chrome.storage.sync.get(null, (data) => {
            if (data) {
                var keys = Object.keys(data).filter( (key) => key.startsWith('ProgTrkr_'))
                                            .sort( (k1, k2) => (new Date(data[k1].time) - new Date(data[k2].time)));
                for (let key of keys) {
                    const url = key.substr('ProgTrkr_'.length) + '?prg_trkr=' + data[key].scroll;
                    $('#sitesList').prepend(
                        getTemplate(data[key].title, 
                                    url, 
                                    data[key].time)
                    );
                }
                // Register mouse events
                $('#sitesList').children('div div').each( (i, el) => {
                    $('> div', el)
                        .mouseenter(() => {
                            $('img.cross', el).css('visibility', 'visible');
                        })
                        .mouseleave(() => {
                            $('img.cross', el).css('visibility', 'hidden');
                        });
                    $('img.cross', el).click( () => {
                        const idx = $('a', el)[0].href.indexOf('?prg_trkr=');
                        var url = idx > 0 ? $('a', el)[0].href.substring(0, idx) : $('a', el)[0].href;
                        const key = 'ProgTrkr_' + url;
                        chrome.storage.sync.remove(key, () => { });
                        $(el).remove();
                    });
                });
            }
        });
    }

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
        <div style="display: flex; flex-direction: column; word-break: break-all; padding-left: 10px; padding-top: 15px; position: relative; font-size: 15px;">
            <div style="width: 50%">
                <img class="cross" src="images/cross.png" 
                     style="visibility: hidden; top: 10px; left: 0px; width: 14px; height: 13px; 
                            vertical-align: middle; padding-top: 2px; cursor: pointer;">
                <img src="https://www.google.com/s2/favicons?domain=${urlDomain}" 
                     style="top: 0px; left: 25px; width: 16px; height: 16px; vertical-align: middle;">
                <a href="${url}" target="_blank" style="padding-right: 12px; text-decoration: none; cursor: pointer; color: #234da7;">
                    <b>${urlDomain.replace('www.', '').split('.')[0].toUpperCase()}</b> ${title}&nbsp
                </a>
            </div>
            <span style="padding-left: 31px; color: #a0a0b5; font-size: 12px"> · ${getTimeString(t)} · ${getTimeAgo(new Date() - t)} ·</span>
        </div>`;
    }

    // Retturns time ago formatted as '<days>d <hours>h <minutes>m ago'
    const getTimeAgo = (milis) => {
        const days = Math.floor(milis / (3600000 * 24));
        const hours = Math.floor(milis / 3600000) % 24;
        const mins = Math.round(milis / 60000) % 60;
        return `${days}d ${hours}h ${mins}m ago`;
    }

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
    }

    // Set timer to refresh the list periodically (to update time ago)
    setInterval(() => {
        $('#sitesList').empty();
        updateUrls();
    }, 60000);

    // Populate list at page open
    updateUrls();
});