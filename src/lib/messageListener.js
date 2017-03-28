const getConfig = require('./getConfig');

module.exports = () => {
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
      if (request === "getConfig") {
        sendResponse(getConfig());
      }
    });
}
