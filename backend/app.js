const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://dbUser:"+ process.env.MONGO_ATLAS_PW +"@cluster0-j7puy.mongodb.net/test?retryWrites=true")
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("failed db")
  });

app.use(bodyParser.json());

//middleware to mess with incoming requests,
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/courses", courseRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
