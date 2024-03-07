const fs = require('fs');
// Utils
const uploadImageUtil = require('../utils/upload_image.util');
const constant = require('../utils/constants.util');

/**
 * File Upload
 *
 * @param {*} req
 * @returns
 */
exports.fileUpload = async (req) => {
  try {
    const filePath = 'uploads/' + req.file.filename;
    // Read the local file as a buffer
    const data = fs.readFileSync(filePath);
    // Created blobName with patientId
    const blobName = `${req.body.patientId}/${req.file.filename}`;
    // Create container if not exist
    await uploadImageUtil.createContainer(process.env.AZURE_STORAGE_CONTAINER_NAME);
    // Upload image into azure dev studio
    await uploadImageUtil.uploadImage(data, blobName);
    // Get size of file
    const sizeOfFile = req.file.size.size;
    // Return data
    let returnData = {
      fileName: `${blobName}`,
      sizeOfFile,
    };
    // Delete file from local
    fs.unlinkSync(filePath);
    return returnData;
  } catch (error) {
    console.log(error);
    throw new Error(constant.FILE_UPLOAD_ERROR);
  }
};