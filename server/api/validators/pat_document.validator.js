const { body } = require('express-validator');

exports.patDocumentSchema = [
    body('file')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('No file uploaded');
            }

            const file = req.file;

            // Check if the file is an image (JPEG, PNG, GIF, etc.) or a PDF
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

            if (!allowedFileTypes.includes(file.mimetype)) {
                throw new Error('Invalid file type. Only images (JPEG, PNG, GIF) and PDFs are allowed.');
            }

            // Check if the file size is smaller than 10 MB
            const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes

            if (file?.size > maxFileSize) {
                throw new Error('File size exceeds the maximum allowed limit of 10 MB.');
            }

            return true;
        })
];
