var express = require("express");
var router = express.Router();

const Project = require("../models/Project");
const Task = require("../models/Task");

router.post("/", (req, res, next) => {
  const { title, description } = req.body;

  Project.create({
    title,
    description,
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

module.exports = router;
