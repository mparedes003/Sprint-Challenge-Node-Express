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

// Add GET ROUTE HANDLER to access the projects
server.get('/api/projects', (req, res) => {
  projects
    .get()
    .then( allProjects => {
      console.log('\n** all projects **', allProjects);
      res.status(200).json(allProjects);
     })
    .catch(err => res.status(500).send({ error: "All projects information could not be retrieved." }));
});

//Add POST ROUTE HANDLER to add a project
server.post('/api/projects', (req, res) => {
  // Check that name and description is present. If not return error message.
  if(!req.body.name || !req.body.description) {
    return res.status(400).send({ errorMessage: "Please provide name and a description for this project." });
    }
  else if(req.body.name.length > 128 && req.body.description ) {
    return res.status(400).send({error: " User name must be less than 128 characters"})
  }
  const { name, description } = req.body;
  const newProject = { name, description };
  projects
    .insert(newProject)
    .then(newProject => {
        console.log(newProject);
        res.status(201).json(newProject);
      })
    .catch(err => res.status(500).send({ error: "There was an error while saving a project to the database" }));

  });

// Call server.listen w/ a port of 5500
server.listen(port, () =>
  console.log(`\n=== API running on port ${port} ===\n`)
);