  const Task = require('../models/Task')
  
  const taskCreate = (req, res, next) => {
    
  Task.create({
    title,
    description,
    project: projectId,
  })
    .then((createdTask) => {
      return Project.findByIdAndUpdate(
        createdTask.project,
        {
          $push: { tasks: createdTask._id },
        },
        {
          new: true,
        }
      );
    })
    .then((projectToPopulate) => {
      return projectToPopulate.populate("tasks");
    })
    .then((populatedProject) => {
      console.log("Populated project with new task ====>", populatedProject);
      res.json(populatedProject);
    })
    .catch((err) => {
      console.log("Error creating task", err);
      res.json({ errorMessage: "Error creating task", err });
    });
  }


  module.exports = {
    taskCreate
  }