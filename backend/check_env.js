const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

let status = '';

if (result.error) {
  status += 'Error loading .env file: ' + result.error.message + '\n';
} else {
  status += '.env file loaded successfully.\n';
  status += 'CLOUDINARY_CLOUD_NAME: ' + (process.env.CLOUDINARY_CLOUD_NAME ? 'Present' : 'MISSING') + '\n';
  status += 'CLOUDINARY_API_KEY: ' + (process.env.CLOUDINARY_API_KEY ? 'Present' : 'MISSING') + '\n';
  status += 'CLOUDINARY_API_SECRET: ' + (process.env.CLOUDINARY_API_SECRET ? 'Present' : 'MISSING') + '\n';
}

fs.writeFileSync('env_status.txt', status);
