// Necessary modules
const http = require('http');
const url = require('url');
const query = require('querystring');

// Handlers for different file types
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');
const mediaHandler = require('./mediaResponses');

// Port to run server on
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Object to hold main searches
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/banner.png': mediaHandler.getImage,
  '/getReviews': jsonHandler.getReviews,
  '/getExample': jsonHandler.getExampleJSON,
  notFound: jsonHandler.notFound,
};

// Handle Post requests
// Add data based on user input from client
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addReview') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addReview(request, res, bodyParams);
    });
  }
};

// Handle Head requests (no body)
// Not real use in this application
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getReviews') {
    jsonHandler.getReviewsMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

// Handle Get requests (body)
const handleGet = (request, response, parsedUrl) => {
  const params = query.parse(parsedUrl.query);
  // Check url and any query parameters
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, params);
  } else {
    urlStruct.notFound(request, response, params);
  }
};

// When a request is made, find out type of request, handle it accordingly
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

// Create server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
