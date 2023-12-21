const db = require('../models');
const constantsUtil = require('../utils/constants.util');
const Order = db.Orders;
const PatientDemo = db.PatientDemos;
const MedicalHistory = db.MedicalHistories;
const MedicalRecord = db.MedicalRecords;
const InsuranceInfo = db.InsuranceInfos;
const Organization = db.Organizations;

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
          as: 'patient',
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
          ],
        },
        {
          model: MedicalHistory,
          as: 'medicalHistory',
          attributes: [
            'id',
            'diagnosis',
            'chemotherapyStatus',
            'orderingProvider',
            'referringProvider',
            'pcpName',
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
  if (filters) {
    // Check and add orderId filter
    if (filters?.orderId) {
      whereClause.id = filters.orderId;
    }

    // Check and add userId filter
    if (filters?.userId) {
      whereClause.createdBy = filters.userId;
    }

    if (filters?.status) {
      whereClause.currentStatus = filters.status;
    }

    // Check and add patient fields filters
    if (filters?.firstName) {
      whereClause['$patient.firstName$'] = filters.firstName;
    }
    if (filters?.lastName) {
      whereClause['$patient.lastName$'] = filters.lastName;
    }
    if (filters?.dob) {
      whereClause['$patient.dob$'] = filters.dob;
    }
    if (filters?.gender) {
      whereClause['$patient.gender$'] = filters.gender;
    }
  }
  const orders = await Order.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: PatientDemo,
        as: 'patient',
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
        ],
      },
      {
        model: MedicalHistory,
        as: 'medicalHistory',
        attributes: [
          'id',
          'diagnosis',
          'chemotherapyStatus',
          'orderingProvider',
          'referringProvider',
          'pcpName',
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
    ],
    order: [[sortBy, sortOrder]],
    offset,
    limit: pageSize,
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
  const mapUploadedFiles = files.map((file) => {
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
  const mapUploadedFiles = files.map((file) => {
    return {
      orderId: order.id,
      createdBy: order.createdBy,
      updatedBy: order.updatedBy,
      patDocumentId: file,
      patientId: order.patientId,
    };
  });
  return await db.OrderAuthDocuments.bulkCreate(mapUploadedFiles);
}
module.exports = {
  createOrderInfo,
  getOrderById,
  listOrders,
  updateOrderInfo,
  uploadFiles,
  getOrderDocuments,
  createOrderAuthDocuments
};
