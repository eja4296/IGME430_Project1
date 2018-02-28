// File to handle all HTLM and CSS responses from server

// pull in the file system module
const fs = require('fs');

// Get path to client index page and main stylesheet
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Get main page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Get main page styles
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// Export modules
module.exports.getIndex = getIndex;
module.exports.getCSS = getCSS;
