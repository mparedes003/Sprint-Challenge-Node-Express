// Import node modules
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');

// Projects and Actions data
const projects = require('./data/helpers/projectModel');
const actions = require('./data/helpers/actionModel');

// Name port
const port = 5500;

//Instanciate your server
const server = express();// creates the server

// Add GLOBAL MIDDLEWARE
server.use(express.json());// formatting our req.body obj
server.use(cors());// this neeeded to connect from react
server.use(logger ('combined'));// combined or tiny
server.use(helmet());

//ROUTES

//Add home route
server.get('/', (req, res) => {
  res.send('You are HOME!');
});

// ========================PROJECTS ENDPOINTS=========================

// Add GET ROUTE HANDLER to access the users
server.get('/api/projects', (req, res) => {
  projects
    .get()
    .then( allProjects => {
      console.log('\n** all projects **', allProjects);
      res.status(200).json(allProjects);
     })
    .catch(err => res.status(500).send({ error: "All projects information could not be retrieved." }));
});

// Call server.listen w/ a port of 5500
server.listen(port, () =>
  console.log(`\n=== API running on port ${port} ===\n`)
);