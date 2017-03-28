const _ = require('underscore');
const MENU = require('../menu');

/**
 * 过滤 localStorage 并应用默认值
 */
const getConfig = () => {
  const config = {};
  Object.keys(MENU).forEach(category => {
    const value = localStorage.getItem(category) || MENU[category].defaultValue
    if (value) {
      config[category] = value;
    }
  });
  return config;
};

module.exports = getConfig;
