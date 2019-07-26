
const path = require('path');
exports.ua = {
  enable: true,
  path: path.join(__dirname, '../app/lib/plugin/egg-ua')
};

exports.token = {
  enable: true,
  path: path.join(__dirname, '../app/lib/plugin/token')
};

exports.cache = {
  enable: true,
  path: path.join(__dirname, '../app/lib/plugin/cache')
};

exports.upload = {
	enable: true,
	path: path.join(__dirname, '../app/lib/plugin/upload')
};

exports.validate = {
	enable: true,
	path: path.join(__dirname, '../app/lib/plugin/validate')
};

// exports.cors = {
//   enable: true,
//   package: 'egg-cors',
// };

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};