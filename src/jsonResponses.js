const reviews = {};

// respond JSON
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// respond JSON meta
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// get reviews
const getReviews = (request, response) => {
  const responseJSON = {
    reviews,
  };
  respondJSON(request, response, 200, responseJSON);
};

// get reviews meta
const getReviewsMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

// not found
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// not found meta
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// function to add a user from a POST body
const addReview = (request, response, body) => {
  // default message
  const responseJSON = {
    message: 'Title and Review are both required.',
  };

  if (!body.title || !body.review) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code 201 (created)
  let responseCode = 201;

  // if user name already exists, switch to a 204 (updated)
  if (reviews[body.title]) {
    responseCode = 204;
  } else {
    // otherwise, create an object with that name
    reviews[body.title] = {};
  }

  reviews[body.title].title = body.title;
  reviews[body.title].author = body.author;
  reviews[body.title].year = body.year;
  reviews[body.title].journal = body.journal;
  reviews[body.title].volume = body.volume;
  reviews[body.title].issue = body.issue;
  reviews[body.title].pages = body.pages;
  reviews[body.title].review = body.review;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};


// public exports
module.exports = {
  getReviews,
  getReviewsMeta,
  notFound,
  notFoundMeta,
  addReview,
};
