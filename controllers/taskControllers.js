const Task = require("../models/Task");
const Project = require('../models/Project')

const taskCreate = (req, res, next) => {
  const { title, description, projectId } = req.body;

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
};

module.exports = {
  taskCreate,
};
