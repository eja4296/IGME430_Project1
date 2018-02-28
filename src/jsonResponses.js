// File to handle all JSON responses from server

// pull in the file system module
const fs = require('fs');

// Get path to example review JSON
const example = fs.readFileSync(`${__dirname}/../client/example.JSON`);

// Object to hold all review data
const reviews = {};

// Get example review
const getExampleJSON = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(example);
  response.end();
};

// Respong JSON
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Respong JSON meta
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Get reviews
const getReviews = (request, response, params) => {
  // If a specific review was requested
  if (reviews[params.review]) {
    const specificReview = {};
    specificReview[params.review] = {};
    specificReview[params.review] = reviews[params.review];
    const responseJSON = {
      specificReview,
    };
    respondJSON(request, response, 200, responseJSON);
  } else { // all reviews requested
    const responseJSON = {
      reviews,
    };
    respondJSON(request, response, 200, responseJSON);
  }
};

// Get reviews meta
const getReviewsMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

// Not found
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

// Not found meta
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// Function to add a user from a POST body
const addReview = (request, response, body) => {
  // Default message is not all necessary parameters are entered
  const responseJSON = {
    message: 'Title and Review are required.',
  };

  // If a title or review are not included, don't send
  if (!body.title || !body.review) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Default status code 201 (created)
  let responseCode = 201;

  // If user name already exists, switch to a 204 (updated)
  if (reviews[body.title]) {
    responseCode = 204;
  } else { // Otherwise, create a new object with that name
    reviews[body.title] = {};
  }

  // Fill reviews object with all of the data for that review
  reviews[body.title].title = body.title;
  reviews[body.title].authorFirstName = body.authorFirstName;
  reviews[body.title].authorMiddleName = body.authorMiddleName;
  reviews[body.title].authorLastName = body.authorLastName;
  reviews[body.title].year = body.year;
  reviews[body.title].journal = body.journal;
  reviews[body.title].volume = body.volume;
  reviews[body.title].issue = body.issue;
  reviews[body.title].pages = body.pages;
  reviews[body.title].review = body.review;

  // Create User
  if (responseCode === 201) {
    responseJSON.message = 'Review Created';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // Update User
  return respondJSONMeta(request, response, responseCode);
};


// Export modules
module.exports = {
  getReviews,
  getReviewsMeta,
  notFound,
  notFoundMeta,
  addReview,
  getExampleJSON,
};
