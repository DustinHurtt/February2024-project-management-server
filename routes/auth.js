var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const saltRounds = 10;

const User = require("../models/User");

router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if the email or password or name is provided as an empty string
  if (!email || !password || !name) {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If the email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user in the database
      // We return a pending promise, which allows us to chain another `then`
      User.create({ email, password: hashedPassword, name })
        .then((createdUser) => {
          // Deconstruct the newly created user object to omit the password
          // We should never expose passwords publicly
          const { email, name, _id } = createdUser;

          // Create a new object that doesn't expose the password
          const user = { email, name, _id };

          // Send a json response containing the user object
          res.status(201).json({ user: user });
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                console.log("This is the error", err)
                res.status(501).json({message: "Provide all fields", err})
            } else if (err.code === 11000) {
                console.log("Duplicate value", err)
                res.status(502).json({message: "Invalid name, password, email.", err})
            } else {
                console.log("Error =>", err)
                res.status(503).json({message: "Error encountered", err})
            }
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;
