// Utils
const uploadImageUtil = require('../utils/upload_image.util');
const constant = require('../utils/constants.util');

/**
 * File Upload
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.fileUpload = async (req) => {
  try {
    let fileName = req.file.originalname;
    req.file.originalname = `${req.file.originalname}`;
    await uploadImageUtil.uploadImage(req.file, `images/${fileName}`);
    const sizeOfFile = req.file.size.size;
    let returnData = {
      fileName: `${process.env.IMAGE_URL}/${fileName}`,
      sizeOfFile,
    };
    return returnData;
  } catch (error) {
    throw new Error(constant.FILE_UPLOAD_ERROR);
  }
};