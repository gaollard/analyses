
module.exports = app => {
  let RemoteErrorTransport = require('./app/RemoteErrorTransport.js');
  app.getLogger('errorLogger').set('remote', new RemoteErrorTransport({ level: 'ERROR', app }));
//   app.beforeStart(async () => {
//     // 应用会等待这个函数执行完成才启动
//     app.cities = await app.curl('http://47.95.193.254:8005/error/list', {
//       method: 'GET',
//       dataType: 'json',
//     });
//   });

};