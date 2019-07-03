$(function () {
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
                // Regester mouse events
                $('#sitesList').children('div div').each( (i, el) => {
                    $('> div', el).mouseenter(() => {
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

    updateUrls();
    
    const getTimeString = (time) => {
        const minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
        return `${time.toDateString()} @ ${time.getHours()}:${minutes}`
    };
    
    setInterval(() => {
        $('#sitesList').empty();
        updateUrls();
    }, 60000);

    const getTemplate = (title, url, time) => {
        var t = new Date(time);
        var urlDomain = extractDomain(url);
        return `<div style="display: flex; flex-direction: column; word-break: break-all; padding: 0.5%; position: relative; font-size: 1.2em;">
                    <div style="width: 50%">
                        <img class="cross" src="images/cross.png" style="visibility: hidden; width: 1rem; vertical-align: middle; cursor: pointer;">
                        <img src="https://www.google.com/s2/favicons?domain=${urlDomain}" style="left: 25px; width: 1.3em; height: 1.3em; vertical-align: middle;">
                        <a href="${url}" target="_blank" style="padding-left: .25em; padding-right: 1em; text-decoration: none; cursor: pointer; color: #234da7;">
                            ${title}&nbsp;
                        </a>
                    </div>
                    <span style="padding-left: 4em; color: #0a375f; font-size: 11px"> · ${getTimeString(t)} · ${getTimeAgo(new Date() - t)} ·</span>
                </div>`;
    }

    const getTimeAgo = (milis) => {
        const days = Math.floor(milis / (3600000 * 24));
        const hours = Math.floor(milis / 3600000) % 24;
        const mins = Math.round(milis / 60000) % 60;
        return `${days}d ${hours}h ${mins}m ago`;
    }

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
});