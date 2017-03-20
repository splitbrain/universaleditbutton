/** store the edit urls for the current tabs */
editlinks = {};

/** receive messages from the content script */
chrome.extension.onMessage.addListener(function (request, sender) {
    editlinks[sender.tab.id] = request.href;

    // Enable the page action icon.
    chrome.pageAction.setTitle(
        {
            tabId: sender.tab.id,
            title: request.title
        }
    );
    chrome.pageAction.show(sender.tab.id);
});

/** remove stored urls again, when the tab is closed */
chrome.tabs.onRemoved.addListener(function (tabId) {
    editors[tabId] = null;
});

/** handle clicks on the page icon */
chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.update(tab.id, {
        url: editlinks[tab.id]
    });
});



