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
  orderingProvider: {
    custom: {
      options: (value, { req }) => {
        // Check if roleId is 4 (Ordering Provider)
        if (req.body.roleId === constants.ORDERING_PROVIDER_ROLE_ID) {
          return value !== undefined && value !== null && value !== ''; // Validate if orderProvider is not empty
        }
        return true;
      },
      errorMessage: constants.ORDER_PROVIDER_REQUIRED_FOR_ORDERING_PROVIDER_ROLE,
    },
  },
};
