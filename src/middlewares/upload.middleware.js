const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Map logical models to subdirectories inside /uploads
const getSubDir = (req) => {
    // We can use the baseUrl to determine the subfolder
    if (req.baseUrl.includes('api/users') || req.baseUrl.includes('api/auth')) return 'users';
    if (req.baseUrl.includes('api/garages')) return 'garages';
    if (req.baseUrl.includes('api/spareparts')) return 'spareparts';
    return 'misc';
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const subDir = getSubDir(req);
        const targetDir = path.join(uploadDir, subDir);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        cb(null, targetDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
