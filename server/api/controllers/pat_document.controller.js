require('dotenv').config();
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');

//Services
const patDocumentService = require('../services/pat_document.service');
const documentTypeService = require('../services/document_type.service');
const patientService = require('../services/patient.service');
const { createLog } = require('../services/audit_log.service');
/**
 * File upload
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @api /api/patientDocument/upload
 * @method POST
 */
exports.upload = async (req, res) => {
  try {
    await createLog(req, 'PatDocuments', 'Upload');
    const reqData = req.body;
    const userId = req?.userData?.id;
    let createdPatDocument;
    // file upload
    const uploadedUrl =
      req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    // check if document type is present
    if (reqData?.type) {
      // get document type
      const patDocType = await documentTypeService.getByName(
        reqData?.type?.toLowerCase()
      );
      // check if patient exist
      if (!patDocType) {
        return res
          .status(constants.BAD_REQUEST)
          .json(errorResponse(constants.notFound('Document Type')));
      }
      // check if patient exist
      const isPatientExist = await patientService.getPatientById(
        reqData.patientId
      );
      if (!isPatientExist) {
        return res
          .status(constants.BAD_REQUEST)
          .json(errorResponse(constants.notFound('Patient')));
      }
      // create patient document
      if (patDocType) {
        const patDocumentData = {
          patientId: reqData.patientId,
          documentTypeId: patDocType?.id,
          documentURL: uploadedUrl,
          createdBy: userId,
          updatedBy: userId,
        };
        createdPatDocument = await patDocumentService.create(patDocumentData);
      }
    }
    return res
      .status(constants.SUCCESS)
      .json(successResponse(constants.FILE_UPLOADED, createdPatDocument));
  } catch (error) {
    await createLog(req, 'PatDocuments', 'Upload', error);
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    return res
      .status(status)
      .json(errorResponse(constants.INTERNAL_SERVER_ERROR, error?.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description delete patient document
 * @api /api/patientDocument/:id
 * @method DELETE
 */
exports.delete = async (req, res) => {
  try {
    await createLog(req, 'PatDocuments', 'Delete');
    const patDocId = req.params.id;
    const deletedPatDocument = await patDocumentService.delete(patDocId);
    return res
      .status(constants.SUCCESS)
      .json(successResponse(constants.message('Patient Document', 'Delete')));
  } catch (error) {
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    await createLog(req, 'PatDocuments', 'Delete', error);
    return res
      .status(status)
      .json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};
