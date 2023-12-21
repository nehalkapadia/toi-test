const { body } = require('express-validator');
const constantsUtil = require('../utils/constants.util');

exports.fileUploadSchema = [
    body('file')
        .custom((value, { req }) => {
            console.log(req.file);
            if (!req.file) {
                throw new Error(constantsUtil.NO_FILE_UPLOADED);
            }

            const file = req.file;

            // Check if the file is an image (JPEG, PNG, GIF, etc.) or a PDF
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

            if (!allowedFileTypes.includes(file.mimetype)) {
                throw new Error(constantsUtil.INVALID_FILE_FORMAT);
            }

            // Check if the file size is smaller than 10 MB
            const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes

            if (file?.size > maxFileSize) {
                throw new Error(constantsUtil.EXCEED_FILE_SIZE_LIMIT);
            }

            return true;
        })
];
