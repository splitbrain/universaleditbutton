var rt = (typeof browser !== 'undefined') ? browser : chrome; 


/** store the edit urls for the current tabs */
editlinks = {};

/** receive messages from the content script */
(rt.runtime || rt.extension).onMessage.addListener(function (request, sender) {
    // store the link
    editlinks[sender.tab.id] = request.href;

    // Enable the page action icon.
    rt.pageAction.setTitle(
        {
            tabId: sender.tab.id,
            title: request.title
        }
    );
    rt.pageAction.show(sender.tab.id);
});

/** remove stored urls again, when the tab is closed */
rt.tabs.onRemoved.addListener(function (tabId) {
    editlinks[tabId] = null;
});

/** handle clicks on the page icon */
rt.pageAction.onClicked.addListener(function (tab) {
    rt.tabs.update(tab.id, {
        url: editlinks[tab.id]
    });
});



