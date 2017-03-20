/** store the edit urls for the current tabs */
editlinks = {};

/** receive messages from the content script */
var rt = browser ? browser.runtime : chrome.extension;
rt.onMessage.addListener(function (request, sender) {
    // store the link
    editlinks[sender.tab.id] = request.href;

    // Enable the page action icon.
    (browser || chrome).pageAction.setTitle(
        {
            tabId: sender.tab.id,
            title: request.title
        }
    );
    (browser || chrome).pageAction.show(sender.tab.id);
});

/** remove stored urls again, when the tab is closed */
(browser || chrome).tabs.onRemoved.addListener(function (tabId) {
    editlinks[tabId] = null;
});

/** handle clicks on the page icon */
(browser || chrome).pageAction.onClicked.addListener(function (tab) {
    (browser || chrome).tabs.update(tab.id, {
        url: editlinks[tab.id]
    });
});



