const db = require('../models');
const PatDocuments = db.PatDocuments;

/**
 *
 * @returns
 * @description List patient documents
 * @access Private
 */
exports.list = async () => {
  return await PatDocuments.findAll();
};

/**
 * @params {object} patDocumentData
 * @returns {object} pat document
 * @description Create document type
 * @access Private
 */
exports.create = async (patDocumentData) => {
  return await PatDocuments.create(patDocumentData);
};

/**
 * @params {int} id
 * @returns {object} pat document
 * @description delete pat document by id
 * @access Private
 */
exports.delete = async (id) => {
  return await PatDocuments.destroy({ where: { id } });
};