require('dotenv').config();
const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');

/**
 * File upload
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @api /api/fileUpload/upload
 * @method POST
 */
exports.fileUpload = async (req, res) => {
  try {    
    const uploadedUrl =
      req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    return res
      .status(constants.SUCCESS)
      .json(successResponse(constants.FILE_UPLOADED, { uploadedUrl }));
  } catch (error) {
    const status = error.status ?? constants.INTERNAL_SERVER_STATUS;
    return res
      .status(status)
      .json(errorResponse(constants.INTERNAL_SERVER_ERROR, error?.message));
  }
};
