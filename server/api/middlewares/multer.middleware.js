const multer = require('multer');

// Get the file name and extension with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder for uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename based on the current timestamp
    const timestamp = Date.now();
    const extension = file.originalname.split('.').pop(); // Get the file extension
    const filename = `${timestamp}.${extension}`;
    cb(null, filename);
  },
});

// Set the storage, file filter and file size with multer
const upload = multer({
  storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 10 * 1024 * 1024,
  },
}).single('file');

module.exports = upload;
