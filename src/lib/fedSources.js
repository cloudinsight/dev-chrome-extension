const wilddog = require('wilddog');
const EventEmitter = require('events');
const _ = require('underscore');

const source = new EventEmitter();

const URLS = [
  'default',
  '127.0.0.1:8000'
];
const URL = 'https://h0r0rop9h6vu9k8oxge5.wilddogio.com/versions';

wilddog.initializeApp({
  syncURL: URL
});

const ref = wilddog.sync().ref();

ref.on("value", snapshot => {
  const versions = snapshot.val();
  const sorted = _.sortBy(versions, 'BUILD_TIME').map(i => i.URL);
  const remoteVersions = _.values(_.unique(sorted));
  source.emit('items', _.union(URLS, remoteVersions))
});

module.exports = source;
