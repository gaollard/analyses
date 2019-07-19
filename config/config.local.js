'use strict';

module.exports = appInfo => {
    const config = exports = {};

    // 日志配置
    config.logger = {
	    level: 'DEBUG',     // 文件日志级别 NONE，DEBUG，INFO，WARN 和 ERROR
	    consoleLevel: 'INFO',   // 终端日志级别 默认为:INFO 及以上（WARN 和 ERROR
        appLogName: `${appInfo.name}-web.log`,
        coreLogName: 'egg-web.log',
        agentLogName: 'egg-agent.log',
        errorLogName: 'common-error.log',
    };

    // api配置
    config.api = {
        prefix: './',
        find: {
            musicUrl: 'error/list'
        }
    };

	return config;
};
