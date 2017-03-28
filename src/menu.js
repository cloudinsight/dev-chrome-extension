module.exports = {
  fed: {
    title: '选择前端版本',
    contexts: ['browser_action'],
    defaultValue: 'default'
  },
  debug: {
    title: '调试',
    contexts: ['browser_action'],
    defaultValue: 'true',
    options: [
      "true",
      "false"
    ]
  },
  links: {
    title: '常用链接',
    contexts: ['browser_action'],
    urls: [
      {
        text: '清理版本',
        href: 'https://cloudinsight.github.io/dev-version-management/'
      }
    ]
  }
};
