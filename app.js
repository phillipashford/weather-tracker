// Import the required modules

const express = require('express');

// 'request' is a popular and widely used library 
// for making HTTP requests from Node.js on the server side.
const request = require('request');

// Initialize the Express app
const app = express();

// Define endpoint for server-side proxy with the 'get' method.
//'proxy' is an arbitrarily chosen name for the endpoint.
app.get('/proxy', (req, res) => {
  // Get URL from query
  const url = req.query.url;
  console.log(url);

  // Send request to the outside API endpoint (url) using the request module
  request(url, (error, response, body) => {
    if (error) {
      // Returns status code if there's an error
      res.status(500).send({ error });
    } else {
      // Returns response from API
      res.send(body);
    }
  });
});

// Checks to see if the port environmental variable has already been defined, and if not 
// assigns '3000'. 3000-6000 are commonly assigned port numbers for development purposes.
const port = process.env.PORT || 3000;

// Starts the Express app
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
