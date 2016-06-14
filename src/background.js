const ref = new Wilddog('https://h0r0rop9h6vu9k8oxge5.wilddogio.com/');
ref.on('value', (snapshot) => {
  chrome.storage.local.set({
    config: snapshot.val()
  });
  chrome.webRequest.onBeforeSendHeaders.addListener(function (info) {
    info.requestHeaders.push({
      name: 'fed',
      value: snapshot.val().dev
    });
    return {
      requestHeaders: info.requestHeaders
    }
  }, {
    urls: [
      "*://cloud.oneapm.com/*"
    ]
  }, ['requestHeaders', "blocking"])
});


