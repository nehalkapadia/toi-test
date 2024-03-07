const db = require('../models');
const { Op } = require('sequelize');
const Organization = db.Organizations;
const User = db.Users;

/**
 *
 * @param {*} email
 * @returns
 * @description Find organization by email
 */
exports.findByEmail = async (email) => {
  return await Organization.findOne({
    where: { email: email },
  });
};

/**
 *
 * @param {*} id
 * @param {*} email
 * @returns
 * @description Find organization by email
 */
exports.isEmailExistWithOtherOrganization = async (id, email) => {
  return await Organization.findOne({
    where: { id: { [Op.ne]: id }, email: email },
  });
};

/**
 *
 * @param {*} phoneNumber
 * @returns
 * @description Find organization by phone number
 */
exports.findByPhoneNumber = async (phoneNumber) => {
  return await Organization.findOne({
    where: { phoneNumber: phoneNumber },
  });
};

/**
 *
 * @param {*} id
 * @param {*} phoneNumber
 * @returns
 * @description Find organization by phone number
 */
exports.isPhoneNumberExistWithOtherOrganization = async (id, phoneNumber) => {
  return await Organization.findOne({
    where: { phoneNumber: phoneNumber, id: { [Op.ne]: id } },
  });
};

/**
 *
 * @param {*} payload
 *  @property {*} payload.page
 *  @property {*} payload.perPage
 *  @property {*} payload.order
 *  @property {*} payload.filters
 *  @property {*} payload.searchText
 * @returns count and list of organizations
 * @description Find all organizations
 *
 */
exports.list = async ({ page, perPage, order, filters, searchText }) => {
  const whereClause = {
    // name: {
    //   [Op.ne]: 'toi',
    // },
  };
  if (searchText) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${searchText}%` } },
      { email: { [Op.like]: `%${searchText}%` } },
      { phoneNumber: { [Op.like]: `%${searchText}%` } },
      { domain: { [Op.like]: `%${searchText}%` } },
    ];
  }
  // Add email filter if provided
  if (filters?.email) {
    whereClause.email = { [Op.like]: `%${filters?.email}%` };
  }

  // Add phoneNumber filter if provided
  if (filters?.phoneNumber) {
    whereClause.phoneNumber = { [Op.like]: `%${filters?.phoneNumber}%` };
  }

  // Add domain filter if provided
  if (filters?.domain) {
    whereClause.domain = { [Op.like]: `%${filters?.domain}%` };
  }

  // Add organization type filter if provided
  if (filters?.organizationType) {
    whereClause.organizationType = { [Op.like]: `%${filters?.organizationType}%` };
  }

  // Add isActive filter if provided
  if (filters?.isActive !== undefined) {
    whereClause.isActive = { [Op.eq]: filters?.isActive };
  }


  if (!page) {
    return await Organization.findAndCountAll({
      where: whereClause,
      order: [
        [
          order?.orderBy ? order?.orderBy : 'updatedAt',
          order?.ascending ? 'ASC' : 'DESC',
        ],
      ],
    });
  }
  return await Organization.findAndCountAll({
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
 *
 * @param {*} id
 * @returns
 * @description Find organization by id
 */
exports.detail = async (id) => {
  return await Organization.findByPk(id);
};

/**
 *
 * @param {*} payload
 * @returns
 * @description Create organization
 */
exports.createOrganization = async (payload) => {
  return await Organization.create(payload);
};

/**
 *
 * @param {*} id
 * @param {*} payload
 * @returns
 * @description Update organization
 */
exports.updateOrganization = async (id, payload) => {
  const updateModel = await Organization.findByPk(id);
  const updatedData = await updateModel.update(payload);
  if (payload.isActive === false) {
    await User.update(
      { isActive: payload.isActive },
      {
        where: {
          organizationId: id,
        },
      }
    );
  }
  return updatedData;
};

/**
 *
 * @param {*} payload
 * @returns
 * @description Delete organization
 */
exports.deleteOrganization = async (payload) => {
  const deleteModel = await Organization.findByPk(payload.id);
  await deleteModel.update({ isActive: false });
  return await User.update(
    { isActive: false },
    {
      where: {
        organizationId: payload.id,
      },
    }
  );
};

/**
 *
 * @param {int} organizationId
 * @returns
 * @description get user by organization id
 */
exports.getUserList = async (organizationId) => {
  return await User.findAll({
    where: { organizationId: organizationId },
    attributes: ['id', 'firstName', 'lastName', 'email', 'isActive'],
  });
};
