// import utils
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');
// import Services
const documentTypeService = require('../services/document_type.service');
const auditLogService = require('../services/audit_log.service');

/**
 * List of document types
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description list of document types
 * @access Private
 * @api /api/documentType
 * @method GET
 */
exports.list = async (req, res) => {
  try {
    await auditLogService.createLog(req, 'DocumentTypes', 'GET');
    const documentTypeList = await documentTypeService.list();
    return res.status(constants.SUCCESS).json(successResponse(constants.message('Document Type', 'List'), documentTypeList));
  } catch (error) {
    await auditLogService.createLog(req, 'DocumentTypes', 'GET', true);
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    return res.status(status).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Create document type
 * @access Private
 * @api /api/documentType
 * @method POST
 */
exports.create = async (req, res) => {
  try {
    // create log
    await auditLogService.createLog(req, 'DocumentTypes', 'Create');
    const reqData = req.body;
    const userId = req?.userData?.id
    // check if document type already exist
    const isExist = await documentTypeService.getByName(reqData.name);
    if(isExist) {
        return res.status(constants.BAD_REQUEST).json(errorResponse(constants.alreadyExist('Document Type')));
    }
    if(userId) {
        reqData.createdBy = userId;
        reqData.updatedBy = userId;
    }
    reqData.name = reqData?.name?.toLowerCase();
    // create document type
    const documentType = await documentTypeService.create(reqData);
    // return response
    return res.status(constants.SUCCESS).json(successResponse(constants.message('Document Type', 'Create'), documentType));
  } catch (error) {
    // create error log
    await auditLogService.createLog(req, 'DocumentTypes', 'Create', true);
    // return error response
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    return res.status(status).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
}


/**
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Delete document type
 * @access Private
 * @api /api/documentType/:id
 * @method DELETE
 */
exports.delete = async (req, res) => {
  try {
    // create log
    await auditLogService.createLog(req, 'DocumentTypes', 'Create');
    const docTypeId = req.params.id;
    await documentTypeService.delete(docTypeId);
    // return response
    return res.status(constants.SUCCESS).json(successResponse(constants.message('Document Type', 'Delete')));
  } catch (error) {
    // create error log
    await auditLogService.createLog(req, 'DocumentTypes', 'Create', true);
    // return error response
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    return res.status(status).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
}
