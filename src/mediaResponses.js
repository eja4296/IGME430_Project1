// File to handle all media responses from server

// pull in the file system module
const fs = require('fs');

// Get path to image
const image = fs.readFileSync(`${__dirname}/../client/banner.png`);

// Get Image function
const getImage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(image);
  response.end();
};

// Export module
module.exports.getImage = getImage;
