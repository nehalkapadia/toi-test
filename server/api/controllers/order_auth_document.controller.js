const { successResponse, errorResponse } = require('../utils/response.util');

const constants = require('../utils/constants.util');
const orderAuthDocumentService = require('../services/order_auth_document.service');
const auditLogService = require('../services/audit_log.service');

/**
 * List of order auth documents
 * @param {*} req
 * @param {*} res
 * @returns
 * @description list order auth documents
 * @access Private
 * @api /api/orderAuthDocument
 * @method GET
 */
exports.list = async (req, res) => {
  try {
    await auditLogService.createLog(req, 'OrderAuthDocuments', 'GET');
    const orderAuthDocuments = await orderAuthDocumentService.list();
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(
          constants.message('Order Auth Documents', 'List'),
          orderAuthDocuments
        )
      );
  } catch (error) {
    await auditLogService.createLog(req, 'OrderAuthDocuments', 'GET', error);
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Create order auth document
 * @access Private
 * @api /api/orderAuthDocument
 * @method POST
 */
exports.create = async (req, res) => {
  try {
    // create log
    await auditLogService.createLog(req, 'OrderAuthDocuments', 'Create');
    const reqData = req.body;
    const userId = req?.userData?.id;
    if (userId) {
      reqData.createdBy = userId;
      reqData.updatedBy = userId;
    }
    // create order auth document
    const orderAuthDocument = await orderAuthDocumentService.create(reqData);
    // return response
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(
          constants.message('Order Auth Document', 'Create'),
          orderAuthDocument
        )
      );
  } catch (error) {
    await auditLogService.createLog(req, 'OrderAuthDocuments', 'Create', error);
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns
 * @description delete order auth document
 * @access Private
 * @api /api/orderAuthDocument/:id
 * @method DELETE
 */
exports.delete = async (req, res) => {
  try {
    // create log
    await auditLogService.createLog(req, 'OrderAuthDocuments', 'DELETE');
    const id = req.params.id;
    // delete order auth document
    await orderAuthDocumentService.delete(id);
    // return response
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(constants.message('Order Auth Document', 'Delete'))
      );
  } catch (error) {
    await auditLogService.createLog(req, 'OrderAuthDocuments', 'DELETE', error);
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.INTERNAL_SERVER_ERROR));
  }
};
