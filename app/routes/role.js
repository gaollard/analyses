'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.get('role-authorityType-add', '/role/authorityType/add', controller.role.authorityType.addAction);
    router.get('role-add', '/role/add', controller.role.role.addAction);
    router.get('role-authority-add', '/role/authority/add', controller.role.authority.addAction);
};
