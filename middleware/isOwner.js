const Project = require("../models/Project");

const isOwner = (req, res, next) => {
  const { projectId } = req.params;

  Project.findById(projectId)
    .then((foundProject) => {
      if (foundProject.owner.toString() === req.user._id) {
        next();
      } else {
        res.status(402).json({ message: "Not authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};

module.exports = isOwner;
