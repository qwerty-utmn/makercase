const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Wrong filetype'), false);
  }
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/static-images/');
  },
  fileFilter,
  filename(req, file, cb) {
    cb(null,
      `${path.parse(file.originalname).name}-${
        Date.now()
      }${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

module.exports = upload;
