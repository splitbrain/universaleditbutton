/*======================================================
 * universaleditbtn.js
 *------------------------------------------------------
 *  * Firefox extension which displays a universaleditbtn icon in the urlbar
 * whenever the loaded page contains a link matching the specified
 * regular expression.
 *
 *
 *======================================================
 */

// Register constructor and destructor
window.addEventListener("load", function() { universaleditbtn.init(); }, false);
window.addEventListener("unload", function() { universaleditbtn.uninit(); }, false);

/**
 * universaleditbtnListener Object
 *
 * Used to handle various events we are interested in. Namely,
 * change of urlbar (new window, new tab) and loading of pages.
 */
var universaleditbtnListener = {

    QueryInterface: function(aIID) {
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports)){
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    },

    onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
        if(aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP) {
            // This fires when the load finishes
            universaleditbtn.lookForWiki(aWebProgress);
        }
        return 0;
    },

    onLocationChange: function(aProgress, aRequest, aURI) {
        // This fires when the location bar changes; i.e load event is confirmed
        // or when the user switches tabs. If you use myListener for more than one tab/window,
        // use aProgress.DOMWindow to obtain the tab/window which triggered the change.

        universaleditbtn.lookForWiki(aProgress);
        return 0;
    },

    onStatusChange: function() {return 0;},
    onProgressChange: function() {return 0;},
    onSecurityChange: function() {return 0;},
    onLinkIconAvailable: function() {return 0;}
};


/**
 * universaleditbtn Object
 *
 * Main object. Deals with parsing links and displaying the icon.
 */
var universaleditbtn = {
    // set to true for debug messages
    do_debug: false,

    // Init the extension (called for each browser window)
    init: function() {
        // Listen for webpage loads
        window.getBrowser().addProgressListener(universaleditbtnListener,
            Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
    },

    lookForWiki: function(aProgress) {
        var doc = content.document;
        universaleditbtn.debug(aProgress.isLoadingDocument);
        universaleditbtn.debug("Doc title: " + content.document.title);


        var universaleditbtnIcon =
            document.getElementById("universaleditbtn-icon");

        // We seem to get multiple state events for a page stop load, so only
        // check through link tags after document has finished loading.
        // Otherwise we get a short list of links and miss tags.
        if ((universaleditbtnIcon != null) &&
            (aProgress.isLoadingDocument == false)) {
            var hasMatch = false;
            var elements = doc.getElementsByTagName("LINK");
            universaleditbtn.debug("Found " + elements.length + " link tags");

            for (var i = 0; i < elements.length; i++) {
                universaleditbtn.debug(i +
                                       ": " + elements[i].tagName +
                                       " : " + elements[i].rel +
                                       " : " + elements[i].type +
                                       " : " + elements[i].title  +
                                       " : " + elements[i].href);

                 if ( 'edit' == elements[i].rel || (
                      ('application/wiki' == elements[i].type ||
                       'application/x-wiki' == elements[i].type) &&
                       'alternate' == elements[i].rel ) ) {
                     hasMatch = elements[i];

                     // Exit for loop after matching the first one.
                     i = elements.length;
                 }
             }

             if (hasMatch) {
                 var tooltip = (hasMatch.title) ? hasMatch.title : hasMatch.href;
                 universaleditbtnIcon.setAttribute("onclick",
                    'window.content.location.href="' + hasMatch.href + '";');
                 universaleditbtnIcon.setAttribute("tooltiptext", tooltip);
                 universaleditbtnIcon.setAttribute("select", "true");
                 universaleditbtn.debug("We got an icon!");
             } else {
                 universaleditbtnIcon.removeAttribute("select");
                 universaleditbtn.debug("We lost an icon");
             }
         }
     },


    debug: function(message) {
        var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
        if (universaleditbtn.do_debug) {
            consoleService.logStringMessage(message);
        }
    },


    uninit: function() {
            gBrowser.removeProgressListener(universaleditbtnListener);
    }
};
