const db = require('../models');
const { Op } = require('sequelize');
const constantsUtil = require('../utils/constants.util');
const Order = db.Orders;
const PatientDemo = db.PatientDemos;
const MedicalHistory = db.MedicalHistories;
const MedicalRecord = db.MedicalRecords;
const InsuranceInfo = db.InsuranceInfos;
const Organization = db.Organizations;
const OrderAuthDocuments = db.OrderAuthDocuments;
const OrderPatDocuments = db.OrderPatDocuments;
const PatDocuments = db.PatDocuments;

/**
 * Checks the existence of a specific entity based on its ID.
 *
 * @param {number} id - The ID of the entity to check.
 * @param {object} model - The Sequelize model for the entity.
 * @param {string} modelName - The name of the entity for error messages.
 * @returns {object} - The entity if it exists, or null if not.
 * @throws {Error} - Throws an error if the entity is not found.
 */
const checkEntityExistence = async (id, model, modelName) => {
  if (!id) {
    return null;
  }

  const entity = await model.findByPk(id);

  if (!entity) {
    const errorMessage = `Invalid ${modelName}Id. ${modelName} not found.`;
    throw new Error(errorMessage);
  }

  return entity;
};

/**
 * Creates a new order after checking the existence of related entities.
 *
 * @param {object} orderData - The data for the new order.
 * @returns {object} - The created order.
 * @throws {Error} - Throws an error if any related entity is not found.
 */
const createOrderInfo = async (orderData) => {
  try {
    // Check the existence of multiple related entities
    const entitiesToCheck = [
      { id: orderData.patientId, model: PatientDemo, name: 'Patient' },
      {
        id: orderData.historyId,
        model: MedicalHistory,
        name: 'MedicalHistory',
      },
      { id: orderData.recordId, model: MedicalRecord, name: 'MedicalRecord' },
      {
        id: orderData.insuranceId,
        model: InsuranceInfo,
        name: 'InsuranceInfo',
      },
      {
        id: orderData.organizationId,
        model: Organization,
        name: 'Organization',
      },
    ];

    await Promise.all(
      entitiesToCheck.map(async (entity) => {
        await checkEntityExistence(entity.id, entity.model, entity.name);
      })
    );

    // If all checks pass, create the order
    return Order.create(orderData);
  } catch (error) {
    throw error; // Propagate the error to be handled in the controller
  }
};

/**
 * Retrieves an order by its ID.
 *
 * @param {number} orderId - The ID of the order to retrieve.
 * @returns {object} - The retrieved order.
 * @throws {Error} - Throws an error if the order is not found.
 */
const getOrderById = async (orderId) => {
  try {
    // Check the existence of the order
    // const order = await checkEntityExistence(orderId, Order, 'Order');
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: PatientDemo,
          as: 'patientDemography',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'dob',
            'gender',
            'primaryPhoneNumber',
            'secondaryPhoneNumber',
            'email',
            'preferredLanguage',
            'race',
            'address',
            'mrn',
          ],
        },
        {
          model: MedicalHistory,
          as: 'medicalHistory',
          attributes: [
            'id',
            'diagnosis',
            'chemoTherapyStatus',
            'orderingProvider',
            'referringProvider',
            'pcpName',
            'isReferringPhysician',
          ],
        },
        {
          model: MedicalRecord,
          as: 'medicalRecord',
          attributes: [
            'id',
            'isRadiologyStatus',
            'isPathologyStatus',
            'isLabStatus',
            'radiologyFacility',
            'pathologyFacility',
            'labFacility',
            'isPreviousAuthorizationStatus',
          ],
        },
        {
          model: InsuranceInfo,
          as: 'insuranceInfo',
        },
        { model: Organization, as: 'organization' },
        { model: db.Users, as: 'ownerData' },
      ],
    });
    return order;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a list of orders with pagination and sorting.
 *
 * @param {Object} params - Parameters for pagination and sorting.
 * @param {number} params.page - The page number for pagination (default: 1).
 * @param {number} params.pageSize - The number of orders per page (default: 10).
 * @param {string} params.sortBy - The field to sort orders by (default: 'createdAt').
 * @param {string} params.sortOrder - The sorting order ('asc' or 'desc', default: 'asc').
 * @returns {Array} - An array of retrieved orders.
 * @throws {Error} - Throws an error if there is an issue fetching orders.
 */
const listOrders = async ({
  page,
  pageSize,
  sortBy,
  sortOrder,
  filters,
  userData,
}) => {
  // Add logic to fetch paginated and sorted orders from the database
  const offset = (page - 1) * pageSize;
  const whereClause = {
    organizationId: userData?.user?.organizationId,
  };

  if(!filters?.status || filters?.status?.length === 0) {
    whereClause.isDeleted = false
  }
  if (filters) {
    // Check and add orderId filter
    if (filters?.orderId) {
      whereClause.id = filters.orderId;
    }

    // Check and add userId filter
    if (filters?.userId && filters?.userId !== 'all') {
      whereClause.createdBy = filters.userId;
    }

    if (filters?.status?.length > 0) {
      whereClause.currentStatus = {
        [Op.in]: filters.status,
      };
    }

    // Check and add patient fields filters
    if (filters?.firstName) {
      whereClause['$patientDemography.firstName$'] = {
        [Op.like]: `%${filters?.firstName}%`,
      };
    }
    if (filters?.lastName) {
      whereClause['$patientDemography.lastName$'] = {
        [Op.like]: `%${filters?.lastName}%`,
      };
    }
    if (filters?.dob) {
      whereClause['$patientDemography.dob$'] = {
        [Op.like]: `%${filters?.dob}%`,
      };
    }
    if (filters?.gender) {
      whereClause['$patientDemography.gender$'] = {
        [Op.like]: `%${filters?.gender}%`,
      };
    }
  }

  const orders = await Order.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: PatientDemo,
        as: 'patientDemography',
        attributes: [
          'id',
          'firstName',
          'lastName',
          'dob',
          'gender',
          'primaryPhoneNumber',
          'secondaryPhoneNumber',
          'email',
          'preferredLanguage',
          'race',
          'address',
          'mrn',
        ],
      },
      {
        model: MedicalHistory,
        as: 'medicalHistory',
        attributes: [
          'id',
          'diagnosis',
          'chemoTherapyStatus',
          'orderingProvider',
          'referringProvider',
          'pcpName',
          'isReferringPhysician',
        ],
      },
      {
        model: MedicalRecord,
        as: 'medicalRecord',
        attributes: [
          'id',
          'isRadiologyStatus',
          'isPathologyStatus',
          'isLabStatus',
          'radiologyFacility',
          'pathologyFacility',
          'labFacility',
          'isPreviousAuthorizationStatus',
        ],
      },
      {
        model: InsuranceInfo,
        as: 'insuranceInfo',
      },
      { model: Organization, as: 'organization' },
      { model: db.Users, as: 'userData' },
      { model: db.Users, as: 'ownerData' },
    ],
    offset,
    limit: pageSize,
    order: [[sortBy ? sortBy : 'updatedAt', sortOrder ? 'ASC' : 'DESC']],
  });
  return orders;
};

/**
 * Updates an order by its ID.
 * @param {number} orderId - The ID of the order to update.
 * @param {object} orderData - The data to update the order with.
 * @returns {object} - The updated order.
 * @throws {Error} - Throws an error if the order is not found.
 */
const updateOrderInfo = async (orderId, orderData) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      const errorMessage = constantsUtil.notFound('Order');
      throw new Error(errorMessage);
    }
    return order.update(orderData);
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {object} order
 * @param {Array} files
 * @returns
 *
 */
const uploadFiles = async (order, files) => {
  const existingDocumentIds = await db.OrderPatDocuments.findAll({
    attributes: ['patDocumentId'],
    where: {
      orderId: order.id,
    },
  });

  const existingIdsSet = new Set(
    existingDocumentIds.map((doc) => doc.patDocumentId)
  );

  const newFiles = files.filter((file) => !existingIdsSet.has(file));

  const mapUploadedFiles = newFiles.map((file) => {
    return {
      orderId: order.id,
      createdBy: order.createdBy,
      updatedBy: order.updatedBy,
      patDocumentId: file,
    };
  });
  return await db.OrderPatDocuments.bulkCreate(mapUploadedFiles);
};

/**
 * @params {int} orderId
 * @returns {object} - The updated order.
 *
 */
const getOrderDocuments = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      const errorMessage = constantsUtil.notFound('Order');
      throw new Error(errorMessage);
    }
    // get documents for an order
    const orderDocuments = await db.OrderPatDocuments.findAll({
      where: { orderId },
      attributes: ['id', 'orderId'],
      include: [
        {
          model: db.PatDocuments,
          as: 'patDocument',
          attributes: ['id', 'documentTypeId', 'documentURL'],
          include: [
            {
              model: db.DocumentTypes,
              as: 'documentType',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    // group documents by document type
    const groupedByDocumentType = orderDocuments.reduce((result, order) => {
      const { patDocument } = order;
      const { documentType } = patDocument;

      if (!result[documentType.name]) {
        result[documentType.name] = [];
      }

      result[documentType.name].push(order);
      return result;
    }, {});
    // return grouped documents
    return groupedByDocumentType;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {object} order
 * @param {array} files
 * @returns
 *
 */
const createOrderAuthDocuments = async (order, files) => {
  const existingDocumentIds = await db.OrderAuthDocuments.findAll({
    attributes: ['patDocumentId'],
    where: {
      orderId: order.id,
    },
  });
  const existingIdsSet = new Set(
    existingDocumentIds.map((doc) => doc.patDocumentId)
  );

  const newFiles = files.filter((file) => !existingIdsSet.has(file));

  const mapUploadedFiles = newFiles.map((file) => {
    return {
      orderId: order.id,
      createdBy: order.createdBy,
      updatedBy: order.updatedBy,
      patDocumentId: file,
      patientId: order.patientId,
    };
  });

  return await db.OrderAuthDocuments.bulkCreate(mapUploadedFiles);
};

/**
 * Save Order as Draft
 *
 * @param {Object} orderData - Data for the order to be saved.
 * @returns {Object} - The saved order.
 * @throws {Error} - Throws an error if there is an issue saving the order.
 */
const saveOrderAsDraft = async (orderData) => {
  try {
    // Check the existence of multiple related entities
    const entitiesToCheck = [
      { id: orderData.patientId, model: PatientDemo, name: 'Patient' },
      {
        id: orderData.historyId,
        model: MedicalHistory,
        name: 'MedicalHistory',
      },
      { id: orderData.recordId, model: MedicalRecord, name: 'MedicalRecord' },
      {
        id: orderData.insuranceId,
        model: InsuranceInfo,
        name: 'InsuranceInfo',
      },
      {
        id: orderData.organizationId,
        model: Organization,
        name: 'Organization',
      },
    ];

    await Promise.all(
      entitiesToCheck.map(async (entity) => {
        await checkEntityExistence(entity.id, entity.model, entity.name);
      })
    );

    // If all checks pass, create the order
    return Order.create(orderData);
  } catch (error) {
    throw error; // Propagate the error to be handled in the controller
  }
};

/**
 * Service function to find an order by ID
 * @param {string} orderId - ID of the order to find
 * @returns {Promise<Object>} - Promise resolving to the found order or null if not found
 */
const findOneById = async (orderId) => {
  try {
    const order = await Order.findOne({ where: { id: String(orderId) } });
    return order;
  } catch (error) {
    throw error;
  }
};

/**
 * Service function to find all order authorization documents by order ID and patient ID
 * @param {string} orderId - ID of the order
 * @param {string} patientId - ID of the patient associated with the order
 * @returns {Promise<Array>} - Promise resolving to an array of order authorization documents
 */
const findAllByOrderIdAndPatientId = async (orderId, patientId) => {
  try {
    const orderAuthDocuments = await OrderAuthDocuments.findAll({
      where: { orderId: orderId, patientId: patientId },
    });
    return orderAuthDocuments;
  } catch (error) {
    throw error;
  }
};

/**
 * Service function to find all order patient documents by order ID
 * @param {string} orderId - ID of the order
 * @returns {Promise<Array>} - Promise resolving to an array of order patient documents
 */
const findAllOrderPatDocuments = async (orderId) => {
  try {
    const orderPatDocuments = await OrderPatDocuments.findAll({
      where: { orderId: orderId },
    });
    return orderPatDocuments;
  } catch (error) {
    throw error;
  }
};

/**
 * Service function to find the latest pat documents by IDs
 * @param {Array} patDocumentIds - Array of pat document IDs to find
 * @param {number} limit - Number of documents to limit the result
 * @returns {Promise<Array>} - Promise resolving to an array of pat documents
 */
const findLatestPatDocumentsByIds = async (patDocumentIds, limit) => {
  try {
    const patDocuments = await PatDocuments.findAll({
      where: { id: patDocumentIds },
      order: [['createdAt', 'DESC']],
      limit: limit,
    });
    return patDocuments;
  } catch (error) {
    throw error;
  }
};

/**
 * delete order by its id
 * @param {string} orderId - ID of the order to delete
 * @returns {Promise<Object>} - Promise resolving to the deleted order
 */
const deleteOrderById = async (orderId) => {
  try {
    await db.OrderAuthDocuments.destroy({ where: { orderId: orderId } });
    await db.OrderPatDocuments.destroy({ where: { orderId: orderId } });
    const order = await Order.destroy({ where: { id: orderId } });
    return order;
  } catch (error) {
    throw error;
  }
};

/**
 * get draft order by patientId
 * @param {int} patientId
 * @returns {Promise<Object>} - Promise resolving to the deleted order
 */
const getOrderByPatientId = async (patientId) => {
  const order = await Order.findOne({
    where: { patientId: patientId, currentStatus: 'draft' },
    order: [['updatedAt', 'DESC']],
    include: [
      {
        model: PatientDemo,
        as: 'patientDemography',
        attributes: [
          'id',
          'firstName',
          'lastName',
          'dob',
          'gender',
          'primaryPhoneNumber',
          'secondaryPhoneNumber',
          'email',
          'preferredLanguage',
          'race',
          'address',
          'mrn',
        ],
      },
      {
        model: MedicalHistory,
        as: 'medicalHistory',
        attributes: [
          'id',
          'diagnosis',
          'chemoTherapyStatus',
          'orderingProvider',
          'referringProvider',
          'pcpName',
          'isReferringPhysician',
        ],
      },
      {
        model: MedicalRecord,
        as: 'medicalRecord',
        attributes: [
          'id',
          'isRadiologyStatus',
          'isPathologyStatus',
          'isLabStatus',
          'radiologyFacility',
          'pathologyFacility',
          'labFacility',
          'isPreviousAuthorizationStatus',
        ],
      },
      {
        model: InsuranceInfo,
        as: 'insuranceInfo',
      },
      { model: Organization, as: 'organization' },
      { model: db.Users, as: 'ownerData' },
    ],
  });
  return order;
};

const softDeleteOrder = async (orderId, userId) => {
  try {
    // Find the order
    const order = await Order.findByPk(orderId);

    // Update the soft delete columns
    order.isDeleted = true;
    order.deletedAt = new Date();
    order.updatedBy = userId;
    order.currentStatus = 'deleted';

    // Save the changes
    await order.save();

    return order;
  } catch (error) {
    throw error;
  }
};

const deleteMany = (date) => {
  return Order.destroy({
    where: {
      isDeleted: true,
      currentStatus: 'deleted',
      deletedAt: {
        [Op.lt]: date,
      },
    },
  });
}

module.exports = {
  createOrderInfo,
  getOrderById,
  listOrders,
  updateOrderInfo,
  uploadFiles,
  getOrderDocuments,
  createOrderAuthDocuments,
  saveOrderAsDraft,
  findOneById,
  findAllByOrderIdAndPatientId,
  findAllOrderPatDocuments,
  findLatestPatDocumentsByIds,
  deleteOrderById,
  getOrderByPatientId,
  softDeleteOrder,
  deleteMany
};
