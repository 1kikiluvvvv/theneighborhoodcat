const multer = require('multer');
const path = require('path');

// Configure multer storage
const colorstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'assets', 'gallery', 'color', 'sheets'));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = Date.now() + extension; // Generate a unique filename
        cb(null, filename);
    },
});


// Create the multer upload middleware
const uploadColor = multer({
    storage: colorstorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
    onError: (err, next) => {
        console.error(err);
        next(err); // Pass the error to the next middleware
    }
});

module.exports = uploadColor;
