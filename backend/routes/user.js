const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require("../models/user");

const router = express.Router();

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User Not Found'});
    }
  })
});

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      role: "USER"
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id, role: fetchedUser.role },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        role: fetchedUser.role,
        email: fetchedUser.email,
        id: fetchedUser._id,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

router.get("", (req, res, next) => {
  User.find().then(documents => {
    res.status(200).json({
      message: 'post success',
      users: documents
    });
  });
});

router.put("/:id", (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    major: req.body.major,
    degree: req.body.degree,
    gpa: req.body.gpa
  })
  User.updateOne({_id: req.params.id}, user).then(result => {
    res.status(200).json({ message: 'update success'})
  });
});

module.exports = router;
