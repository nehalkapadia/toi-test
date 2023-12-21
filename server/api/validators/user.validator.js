const constants = require("../utils/constants.util");

/* create user schema */
exports.createUserSchema = {
  email: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Email"),
  },
  firstName: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("First Name"),
  },
  lastName: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Last Name"),
  },
  roleId: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Role Id"),
  },
  organizationId: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Organization Id"),
  },
};
