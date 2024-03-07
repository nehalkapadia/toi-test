const constants = require("../utils/constants.util");

/* create organization schema */
exports.createOrganizationSchema = {
  name: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Name"),
  },
  domain: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Domain"),
  },
  email: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Email"),
  },
  phoneNumber: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Phone Number"),
    isLength: {
      Option: { max: 10 },
      errorMessage: 'Please enter valid phone number',
    },
  },
  organizationType: {
    notEmpty: true,
    errorMessage: constants.cantBeEmpty("Organization Type"),
  }
};
