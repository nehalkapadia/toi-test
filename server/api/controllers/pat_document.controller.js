require('dotenv').config();
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');

//Services
const patDocumentService = require('../services/pat_document.service');
const documentTypeService = require('../services/document_type.service');
const patientService = require('../services/patient.service');
const { createLog } = require('../services/audit_log.service');
const { formatRequest } = require('../utils/common.util');
const { fileUpload } = require('../services/file_upload.service');
const { downloadImage } = require('../utils/upload_image.util');

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
    await createLog(formatRequest(req), 'PatDocuments', 'Upload');
    const reqData = req.body;
    const userId = req?.userData?.id;
    let createdPatDocument;
    // file upload
    const uploadedUrl =
      req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    const uploadData = await fileUpload(req);
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
          documentURL: uploadData?.fileName
            ? uploadData?.fileName
            : uploadedUrl,
          documentName: req.file.originalname,
          documentSize: req.file.size,
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
    console.log('error', error);
    await createLog(formatRequest(req), 'PatDocuments', 'Upload', error);
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
    await createLog(formatRequest(req), 'PatDocuments', 'Delete');
    const patDocId = req.params.id;
    if (req?.query?.orderId && req?.query?.uploaded !== 'true') {
      await patDocumentService.softDelete(
        patDocId,
        req?.query?.orderId,
        req?.query?.isAuth
      );
    } else if (!req?.query?.orderId && req?.query?.uploaded === 'false') {
      return res
        .status(constants.SUCCESS)
        .json(successResponse(constants.message('Patient Document', 'Deleted')));
    } else {
      await patDocumentService.delete(patDocId);
    }
    return res
      .status(constants.SUCCESS)
      .json(successResponse(constants.message('Patient Document', 'Deleted')));
  } catch (error) {
    console.log(error);
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    await createLog(formatRequest(req), 'PatDocuments', 'Delete', error);
    return res
      .status(status)
      .json(
        errorResponse(
          error?.message ? error?.message : constants.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * Controller function to get patient details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Patients getPatientById
 * @api /api/patients?
 * @method GET
 */
exports.getLatestDocuments = async (req, res) => {
  try {
    // Extract user ID from request data
    const userId = req?.userData?.id;
    // Extract patient ID from request parameters
    const patientId = req.query.patientId;
    const orderId = req?.query?.orderId ? req?.query?.orderId : '';
    const orderTypeId = req?.query?.orderTypeId ? req?.query?.orderTypeId : '';

    // Check if the patient exists
    const isPatientExist = await patientService.getPatientById(patientId);

    // If patient does not exist, return a bad request response
    if (!isPatientExist) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.PATIENT_NOT_FOUND));
    }

    // get all the latest documents
    const latestDocuments =
      await patDocumentService.getLatestDocumentsByPatientAndOrderId(
        patientId,
        orderId,
        orderTypeId,
      );

    // Return success response with the latest documents data
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(constants.LATEST_DOCUMENTS_FETCHED, latestDocuments)
      );
  } catch (error) {
    // Handle errors and log them
    await createLog(
      formatRequest(req),
      'PatDocuments',
      'GetLatestDocuments',
      error
    );

    // Determine the response status based on the error or use internal server status
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;

    // Return an error response with the appropriate status and error message
    return res
      .status(status)
      .json(errorResponse(constants.INTERNAL_SERVER_ERROR, error?.message));
  }
};

/**
 * Download patient documents
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Download patient documents
 * @api /api/patientDocument/download/:id
 * @method GET
 */
exports.download = async (req, res) => {
  try {
    await createLog(formatRequest(req), 'PatDocuments', 'Download');
    const patDocId = req.params.id;
    const patDoc = await patDocumentService.getById(patDocId);
    if (!patDoc) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.notFound('Patient Document')));
    }
    // Download the blob (file) from Azure Blob Storage
    const blobName = patDoc?.documentURL;
    const response = await downloadImage(blobName);
    // Set response headers
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${response.blobName}`
    );
    res.setHeader('Content-Type', response.contentType);
    res.setHeader('Content-Length', response.content.length);

    // Send the content to the browser
    res.send(response.content);
  } catch (error) {
    await createLog(formatRequest(req), 'PatDocuments', 'Download', error);
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    return res
      .status(status)
      .json(errorResponse(constants.INTERNAL_SERVER_ERROR, error?.message));
  }
};
