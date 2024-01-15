// imageController.js

const imageService = require('../services/imageService');

const uploadImage = (req, res, next) => {
  // Call the function to handle image upload to S3
  imageService.uploadImageToS3(req, res, (err) => {
    if (err) {
      return next(err);
    }

    // Call the function to save the image URL to MongoDB
    imageService.saveImageUrlToMongoDB(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // Now, you can send a response or perform other actions if needed
      const imageUrl = req.file.location;
      res.json({ imageUrl });
    });
  });
};

module.exports = {
  uploadImage,
};
