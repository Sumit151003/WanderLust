const {v2 : cloudinary} = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust_Development',
    allowedFormats: ['png', 'jpeg', 'jpg'],
  },
});

module.exports = {
  storage, 
  cloudinary
}