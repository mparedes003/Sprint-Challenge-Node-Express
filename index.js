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

  //Add DELETE ROUTE HANDLER to delete a project
server.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projects.remove(id);
    if (project === 0) {
      return res.status(404).json({ message: "The project with the specified ID does not exist." });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "The project could not be removed" });
  }
});

//Add PUT ROUTE HANDLER to update a project's name and description
server.put('/api/projects/:id', async (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).send({ errorMessage: "Please provide name and description for the user." });
   } try {
    await projects.update(req.params.id, req.body);
    try {
    const project = await projects.get(req.params.id);
    if (project.length === 0) {
      return res.status(404).send({ message: "The project with the specified ID does not exist." });
    } else {
      return res.status(200).json(project);
    }
   } catch (error) {
      return res.status(500).send({ error: "The project information could not be modified." });
   }
  } catch (error) {
    return res.status(500).send({ error: "The project information could not be modified." });
 }
});

// ========================ACTIONS ENDPOINTS=========================

// Add GET ROUTE HANDLER to access the actions
server.get('/api/actions', (req, res) => {
  actions
    .get()
    .then( allActions => {
      console.log('\n** all actions **', allActions);
      res.status(200).json(allActions);
     })
    .catch(err => res.status(500).send({ error: "All actions information could not be retrieved." }));
});

//Add DELETE ROUTE HANDLER to delete a action
server.delete("/api/actions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const action = await actions.remove(id);
    if (action === 0) {
      return res.status(404).json({ message: "The action with the specified ID does not exist." });
    }
    res.status(200).json(action);
  } catch (error) {
    res.status(500).json({ error: "The action could not be removed" });
  }
});

// Call server.listen w/ a port of 5500
server.listen(port, () =>
  console.log(`\n=== API running on port ${port} ===\n`)
);