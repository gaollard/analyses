'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.post('reg', '/reg', controller.users.reg.regAction);
    router.get('reg', '/reg', controller.users.reg.regAction);

    router.post('login', '/login', controller.users.login.loginAction);
    router.get('login', '/login', controller.users.login.loginAction);
};
