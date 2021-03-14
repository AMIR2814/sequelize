const { roles, permission } = require('./enums');

const roleRights = new Map();
roleRights.set(roles.ADMIN, [
  // users
  permission.GET_USERS,
  permission.MANAGE_USERS,
]);

roleRights.set(roles.USER, [
]);

module.exports = {
  roles,
  roleRights,
};
