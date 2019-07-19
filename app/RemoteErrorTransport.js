const util = require('util');
const Transport = require('egg-logger').Transport;

class RemoteErrorTransport extends Transport {

  // 定义 log 方法，在此方法中把日志上报给远端服务
  log(level, args) {
    let log;
    if (args[0] instanceof Error) {
      const err = args[0];
      log = util.format('%s: %s\n%s\npid: %s\n', err.name, err.message, err.stack, process.pid);
    } else {
      log = util.format(...args);
  }

  console.log("==============================捕获错误-发送=============================================");
  console.log(log);
  console.log("==============================捕获错误-完毕=============================================");
  }
}

module.exports = RemoteErrorTransport;