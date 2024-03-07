const db = require('../models');
const { Op } = require('sequelize');
const User = db.Users;
const Organization = db.Organizations;

/**
 * @param {*} email
 * @returns
 * @description Find user by email
 */
exports.findByEmail = async (email) => {
  const user = await User.findOne({
    where: { email: email },
  });
  return user;
};

/**
 * @param {*} email
 * @returns
 * @description find user by email which exist with other user
 */
exports.isEmailExistWithOtherUser = async (id, email) => {
  const user = await User.findOne({
    where: { id: { [Op.ne]: id }, email: email },
  });
  return user;
};

/**
 * @param {*} email
 * @returns
 * @description Find user by email and status
 */
exports.findByEmailAndStatus = async (email) => {
  const user = await User.findOne({
    where: { email: email, isActive: true },
  });
  return user;
};

/**
 * @returns
 * @description user list
 */
exports.list = async () => {
  return await User.findAll();
};

/**
 * @param {*} payload
 *   @property {*} payload.page
 *   @property {*} payload.perPage
 *   @property {*} payload.order
 *   @property {*} payload.filters
 *   @property {*} payload.searchText
 *   @property {*} payload.organizationId
 * @returns
 * @description user list with filters
 */
exports.allList = async ({
  page,
  perPage,
  order,
  filters,
  searchText,
  organizationId,
}) => {
  const whereClause = {};
  if (organizationId) {
    whereClause.organizationId = organizationId;
  }
  
  // Add email filter if provided
  if (filters?.email) {
    whereClause.email = { [Op.like]: `%${filters?.email}%` };
  }

  // Add phoneNumber filter if provided
  if (filters?.firstName) {
    whereClause.firstName = { [Op.like]: `%${filters?.firstName}%` };
  }

  // Add domain filter if provided
  if (filters?.lastName) {
    whereClause.lastName = { [Op.like]: `%${filters?.lastName}%` };
  }

  // Add isActive filter if provided
  if (filters?.isActive !== undefined) {
    whereClause.isActive = { [Op.eq]: filters?.isActive };
  }

  // Add ordering provider filter if provided
  if(filters?.orderingProvider) {
    whereClause.orderingProvider = { [Op.eq]: filters?.orderingProvider };
  }

  // Add roleId filter if provided
  if(filters?.roleId) {
    whereClause.roleId = { [Op.eq]: filters?.roleId };
  }

  if (!page) {
    return await User.findAndCountAll({
      where: whereClause,
      order: [
        [
          order?.orderBy ? order?.orderBy : 'updatedAt',
          order?.ascending ? 'ASC' : 'DESC',
        ],
      ],
    });
  }
  return await User.findAndCountAll({
    where: whereClause,
    limit: perPage,
    offset: (page - 1) * perPage,
    order: [
      [
        order?.orderBy ? order?.orderBy : 'updatedAt',
        order?.ascending ? 'ASC' : 'DESC',
      ],
    ],
  });
};

/**
 * @param {*} id
 * @returns
 * @description user detail
 */
exports.detail = async (id) => {
  return await User.findByPk(id, {
    include: [
      {
        model: db.Roles,
        as: 'role',
        attributes: ['id', 'roleName'], // Specify the fields you want from the Roles model
      },
      {
        model: db.Organizations,
        as: 'organization',
        attributes: ['id', 'name', 'email', 'phoneNumber'], // Specify the fields you want from the Roles model
      },
      {
        model: db.Users,
        as: 'createBy',
        attributes: ['id', 'firstName', 'lastName', 'email'], // Specify the fields you want from the Roles model
      },
      {
        model: db.Users,
        as: 'updateBy',
        attributes: ['id', 'firstName', 'lastName', 'email'], // Specify the fields you want from the Roles model
      },
      {
        model: db.Npis,
        as: 'orderingProviderData',
        attributes: ['id', 'first_name', 'last_name', 'npiNumber'], // Specify the fields you want from the Roles model
      },
    ],
  });
};

/**
 * @param {*} payload
 * @returns
 * @description create user
 */
exports.createUser = async (payload) => {
  return await User.create(payload);
};

/**
 * @param {*} id
 * @param {*} payload
 * @returns
 * @description update user
 */
exports.updateUser = async (id, payload) => {
  const updateModel = await User.findByPk(id);
  return await updateModel.update(payload);
};

/**
 * @param {*} payload
 * @returns
 * @description delete user
 */
exports.deleteUser = async (payload) => {
  const deleteModel = await User.findByPk(payload.id);
  return await deleteModel.update({ isActive: false });
};

/**
 * @param {*} orderingProvider
 * @param {*} organizationId
 * @returns
 * @description Check if an active user with the same orderingProvider exists in another organization
 */
exports.getOrderingProviderInfo = async (orderingProvider, organizationId) => {
  const user = await User.findOne({
    where: {
      orderingProvider: orderingProvider,
      isActive: true, // User should be active
      organizationId: { [Op.ne]: organizationId } // User should be from a different organization
    },
    include: [{
      model: Organization,
      as: 'organization',
      attributes: ['name'] // Include only organization name
    }]
  });
  return user;
};

/**
 * @param {*} orderingProvider
 * @param {*} organizationId
 * @returns
 * @description  Checks if the ordering provider exists in the same organization.
 */
exports.orderingProviderExistsInOrganization = async (orderingProvider,organizationId ) => {
  try {
    const user = await User.findOne({
      where: {
        orderingProvider: orderingProvider,
        organizationId: organizationId
      }
    });
    return !!user; // Return true if user exists, false otherwise
  } catch (error) {
    throw new Error('Error checking ordering provider existence in organization: ' + error.message);
  }
};

/**
 * @param {*} orderingProvider
 * @returns {Promise} A promise that resolves with the user object if found, otherwise resolves with null.
 * @description Checks if the ordering provider exists in the same organization.
 */
exports.checkIfActiveOrderingProviderExists = async (payload) => {
  try {
    const user = await User.findOne({
      where: {
        orderingProvider: payload.orderingProvider,
        isActive: true, // User should be active
      }
    })
    return user;
  } catch (error) {
    throw new Error(error.message)
  }
}