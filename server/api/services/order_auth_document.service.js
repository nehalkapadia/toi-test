const db = require('../models');
const OrderAuthDocuments = db.OrderAuthDocuments;

/**
 *
 * @params {object} orderAuthDocumentData
 * @returns {object} order auth document
 * @description Create order auth document
 * @access Private
 */
exports.create = async (orderAuthDocumentData) => {
  return await OrderAuthDocuments.create(orderAuthDocumentData);
};

/**
 * @params {int} id
 * @returns {object} order auth document
 * @description delete order auth document by id
 * @access Private
 */
exports.delete = async (id) => {
  return await OrderAuthDocuments.destroy({ where: { id } });
};

/**
 *
 * @returns
 * @description List order auth documents
 * @access Private
 */
exports.list = async () => {
  return await OrderAuthDocuments.findAll();
};

/**
 *
 * @param {int} patientId
 * @returns
 * @description Get order auth document by patient id
 * @access Private
 */
exports.getOrderAuthDocumentByPatientId = async (patientId, orderId) => {

  const whereClause = { patientId };
  if (orderId) {
    whereClause.orderId = orderId;
  }
  return await OrderAuthDocuments.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'patientId', 'orderId', 'patDocumentId'],
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
            where: {
              isAuthDoc: true, // Add this condition
            },
          },
        ],
        required: true
      }
    ],
    limit: 5,
  });
};
