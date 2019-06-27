$(function () {
    chrome.storage.sync.get(null, (data) => {
        if (data) {
            for (let key of Object.keys(data)) {
                if (key.startsWith('ProgTrkr_')) {
                    // Our key, add it to the list
                    $('#sitesList').append(
                        $('<li>').append(
                            $('<a>').attr('href', key.substr('ProgTrkr_'.length) + '?prg_trkr=' + data[key].scroll)
                                    .attr('id', key)
                                    .attr('target', '_blank').append(
                                        $('<div/>').text(data[key].title))
                        )
                    );
                }
            }
        }
    });
});