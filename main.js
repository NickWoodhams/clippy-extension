chrome.browserAction.onClicked.addListener(
  function(tab) {
    chrome.tabs.executeScript(tab.id, {file:"jquery-1.7.1.min.js"} );
    chrome.tabs.executeScript(tab.id, {file:"clippy.js"} );
  }
);