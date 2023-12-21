const multer = require('multer');

// Get the file name and extension with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder for uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${file.originalname}`;
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
