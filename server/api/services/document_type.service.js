const db = require('../models');
const DocumentTypes = db.DocumentTypes;

/**
 *
 * @returns
 * @description List document types
 * @access Private
 */
exports.list = async () => {
  return await DocumentTypes.findAll({
    where: { isAuthDoc: true },
  });
};

/**
 * @params {object} documentTypeData
 * @returns {object} documentType
 * @description Create document type
 * @access Private
 */
exports.create = async (documentTypeData) => {
  return await DocumentTypes.create(documentTypeData);
};

/**
 * @params {string} name
 * @returns {object} documentType
 * @description Get document type by name
 * @access Private
 */
exports.getByName = async (name) => {
  return await DocumentTypes.findOne({ where: { name } });
};

/**
 * @params {int} id
 * @returns {object} documentType
 * @description delete document type by id
 * @access Private
 */
exports.delete = async (id) => {
  return await DocumentTypes.destroy({ where: { id } });
};
