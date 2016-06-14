import $ from 'jquery';

chrome.storage.local.get('config', (item)=> {
  $('body').text(JSON.stringify(item.config));
});
