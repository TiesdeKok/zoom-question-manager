chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});

    var mutedInfo = activeTab.mutedInfo;
    if (mutedInfo) chrome.tabs.update(activeTab.id, {"muted": true});
  });
});
