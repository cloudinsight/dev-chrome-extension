const getConfig = require('./getConfig');

const getBadge = () => {
  const fed = getConfig().fed;
  switch (fed) {
    case 'default':
      return '';
    case '127.0.0.1:8000':
      return 'dev';
    default:
      return 'ON';
  }
}

module.exports = () => {
  chrome.browserAction.setBadgeText({
    text: getBadge()
  });
};
