chrome.browserAction.onClicked.addListener(
  function(tab) {
    chrome.tabs.executeScript(null, {file:"clippy.js"}, function() {
        chrome.tabs.executeScript(null, {code:"activatePicker();", runAt:"document_end"});
    });
  }
);
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.tabs.captureVisibleTab(
            null,
            {format:'png'},
            function(dataUrl)
            {
                sendResponse({imgSrc:dataUrl});
            }
        );
        return true;
    }
);
