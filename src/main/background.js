/**
 * Browser icon action
 */
chrome.browserAction.onClicked.addListener((tab) => {
    // Open options page
    chrome.tabs.create({ 'url': "./src/options/options.html" })
})