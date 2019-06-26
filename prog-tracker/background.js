chrome.runtime.onInstalled.addListener(() => {
    // chrome.storage.sync.set({color: '#3aa757'}, () => {
    //     console.log("The color is green.");
    // });
    // chrome.declarativeContet.onPageChanged.removeRules(undefined, () => {
    //     chrome.declarativeContent.onPageChanged.addRules([{
    //         actions: [
    //           new chrome.declarativeContent.ShowPageAction()
    //         ],
    //         conditions: [
    //           new chrome.declarativeContent.PageStateMatcher(
    //               {css: ["video"]}
    //           )
    //         ]
    //     }]);
    // });
});
chrome.storage.onChanged.addListener((changes) => {
    console.log(changes);
    // const list = document.getElementById('sitesLst');
    // const item = document.createElement('li');
    // const url = changes[Object.keys(changes)[0]];
    // console.log(url);
    // item.appendChild(document.createTextNode(url));
    // list.appendChild(item);
});

// window.scrollTo(window.scrollX, 100)