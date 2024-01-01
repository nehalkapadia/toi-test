const db = require('../models');
const PatDocuments = db.PatDocuments;
const DocumentTypes = db.DocumentTypes;
const constants = require('../utils/constants.util');
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
 * @returns {object} deletedPatDocument
 * @description Soft delete PatDocument by id
 * @access Private
 */
exports.softDelete = async (id, orderId) => {
    try {
      let whereClause = {
        patDocumentId: id,
      }
      if(orderId) {
        whereClause.orderId = orderId;
      }
      // Find the PatDocument by ID
      const orderPatDocument = await db.OrderPatDocuments.findOne({
        where: whereClause,
      });

      if (!orderPatDocument) {
        // Handle the case where the PatDocument is not found
        throw new Error(constants.PATIENT_DOCUMENT_NOT_FOUND);
      }

      // Soft delete by setting the deletedAt field
      await orderPatDocument.update({ deletedAt: new Date() });

      // Return the deleted PatDocument if needed
      return orderPatDocument;
    } catch (error) {
      // Handle other potential errors here
      throw error;
    }
},


/**
 * Fetch all document types.
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of document types.
 * @throws {Error} - Throws an error if there's an issue fetching document types.
 * @description This function asynchronously fetches all document types from the database.
 */
exports.getAllDocumentTypes = async () => {
  try {
    const documentTypes = await DocumentTypes.findAll();
    return documentTypes;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch the latest documents for a given document type and patient.
 *
 * @param {number} patientId - The ID of the patient.
 * @param {number} documentTypeId - The ID of the document type.
 * @param {number} [limit=5] - The maximum number of documents to fetch (default is 5).
 * @returns {Promise<Object>} - A promise that resolves to an object containing document details.
 * @throws {Error} - Throws an error if there's an issue fetching documents.
 *
 * @description
 * This function asynchronously fetches the latest documents of a specific type for a given patient.
 * It orders the documents by creation date in descending order and includes document type details
 * such as ID and name in the response.
 */
exports.getLatestDocumentsByType = async (patientId, documentTypeId, limit = 5) => {
  try {
    const documents = await PatDocuments.findAll({
      where: {
        patientId,
        documentTypeId,
      },
      order: [['createdAt', 'DESC']],
      limit,
    });

    // Fetch document type details
    const documentType = await DocumentTypes.findByPk(documentTypeId);

    // Include document type ID and name in the response
    const result = {
      documentTypeId: documentTypeId,
      documentTypeName: documentType ? documentType.name : 'Unknown', // Use 'Unknown' if not found
      documents: documents,
    };

    return result;
  } catch (error) {
    throw error;
  }
};
