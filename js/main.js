chrome.browserAction.onClicked.addListener(
  function(tab) {
    chrome.tabs.executeScript(tab.id, {file:"js/clippy.js"} );
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
        ); //remember that captureVisibleTab() is a statement
        return true;
    }
);
// chrome.runtime.onMessage.addListener(function(message, sender, responder){
//     chrome.tabs.captureVisibleTab(null, {format:'png'},function(imageURI){
//         console.log('Could I get imageURI?', imageURI);
//     });
// });
