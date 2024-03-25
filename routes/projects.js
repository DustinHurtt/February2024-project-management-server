var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Project = require("../models/Project");
const Task = require("../models/Task");

const isAuthenticated = require('../middleware/isAuthenticated')
const isOwner = require('../middleware/isOwner')

router.post("/", isAuthenticated, (req, res, next) => {
  const { title, description } = req.body;

  Project.create({
    title,
    description,
    owner: req.user._id
  })
    .then((createdProject) => {
      console.log("this is the created project ===>", createdProject);
      res.json(createdProject);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.get("/", (req, res, next) => {
  Project.find()
    .populate("tasks")
    .then((foundProjects) => {
      console.log("Found Projects ===>", foundProjects);
      res.json(foundProjects);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.get("/details/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findById(projectId)
    .populate("tasks")
    .then((foundProject) => {
      console.log("Found project ===>", foundProject);
      res.json(foundProject);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.put("/update/:projectId", isAuthenticated, isOwner, (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .populate("tasks")
    .then((updatedProject) => {
      console.log("Updated project ====>", updatedProject);
      res.json(updatedProject);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.delete("/delete/:projectId", isAuthenticated, isOwner, (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndDelete(projectId)
    .then((deletedProject) => {
      console.log("This is our deleted project", deletedProject);
      let taskIds = [...deletedProject.tasks];
      let taskDeletions = taskIds.map((task) => {
        return Task.findByIdAndDelete(task);
      });
      Promise.allSettled(taskDeletions)
        .then((deletedTasks) => {
          console.log("Deleted Tasks ==>");
          res.json({ deletedProject, deletedTasks });
        })
        .catch((err) => {
          console.log(err);
          res.json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});


// router.delete("/delete/:projectId", (req, res, next) => {
//   const { projectId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(projectId)) {
//     res.status(400).json({ message: "Specified id is not valid" });
//     return;
//   }

//   Project.findByIdAndDelete(projectId)
//     .then((deletedProject) => {
//       console.log("This is our deleted project", deletedProject);

//       Task.deleteMany({project: deletedProject._id})
//         .then((deletedTasks) => {
//           console.log("These are the deleted tasks")
//           res.json({ deletedProject, deletedTasks})
//         })
//         .catch((err) => {
//           console.log(err);
//           res.json(err);
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json(err);
//     })
    
// });

module.exports = router;
