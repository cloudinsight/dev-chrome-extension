/**
 * 处理 Message 的回调函数
 *
 * @param versionsMap
 * @param fed
 */
const onFedResponse = ({ versionsMap, fed }) => {

  // 检查当前页面 fed 是否生效
  const link = document.querySelector(`link[rel*=icon]`);
  if (link && link.href.indexOf(`${fed}/favicon.ico`) > 0) {

    console.group('https://chrome.google.com/webstore/detail/cloudinsight-dev/bglckjbhffgndhlgbkbhhblpnhfapjpl');
    console.log(`正在使用前端版本 %c ${fed} `, 'background:#f5c538; color:black; font-size:1.2em; margin:0; padding: 0');
    console.groupEnd();

    // 如果使用的是 127.0.0.1:8000 的资源但是访问的是 HTTPS 的站点，则跳回 HTTP 站点
    if (window.location.protocol === 'https:' && fed === '127.0.0.1:8000') {
      window.location.protocol = 'http';
    }
  }
}

// 发送查询请求
chrome.runtime.sendMessage('get_info', onFedResponse);
