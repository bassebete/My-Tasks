const express = require('express');

const server = express();

server.use(express.json());

var cont = 0;
const projects = [];

function logRequest(res, req, next){
  cont += 1;
  console.log("Request Number "+cont);
  return next();
}

//Log of aplication
server.use(logRequest);

//Middlewares
function checkId(req, res, next){
  const { id } = req.params;

  const project = projects.find(f => f.id == id);
  
  if(!project){
    return res.status(400).json({ error: "Project ID "+ req.params.id + " does not exist"});
  }

  return next();
}

//List Project
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Created Projects
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json("project " + title +" criated");
});

//Edit Title
server.put('/projects/:id',checkId, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const newP = projects.find(f => f.id == id);

    var newT = newP.title;
    
    newP.title = title;

    return res.json(newT + " Edited");
});

//Delete Project
server.delete('/projects/:id',checkId, (req, res) => {
  const { id } = req.params;

  const deleteP = projects.find(f => f.id == id);
  var msg = deleteP.title;

  projects.splice(deleteP, 1);

  return res.json(msg +" Deleted");
});

//Add Task
server.post('/projects/:id/tasks',checkId, (req, res) => {
  const { id } = req.params;
  const { newTask } = req.body;

  const tasksP = projects.find(f => f.id == id);

  tasksP.tasks.push(newTask);

  return res.json("New Task Add");
});


server.listen(3333);