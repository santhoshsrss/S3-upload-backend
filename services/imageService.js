// imageService.js

const Image = require('../models/Image');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, 'images/' + uuidv4() + file.originalname);
    },
  }),
});

const uploadImageToS3 = (req, res, next) => {
  // Handle image upload
  upload.single('image')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

const saveImageUrlToMongoDB = async (req, res, next) => {
    try {
      // Assuming req.file.location contains the S3 image URL
      const imageUrl = req.file.location;
  
      // Save the image URL to MongoDB using async/await
      const image = new Image({ imageUrl });
      await image.save();
  
      // Continue to the next middleware or send a response if needed
      next();
    } catch (error) {
      // Handle the error appropriately
      next(error);
    }
  };

module.exports = {
  uploadImageToS3,
  saveImageUrlToMongoDB,
};
