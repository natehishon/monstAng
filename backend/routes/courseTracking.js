const express = require('express');
const CourseTrackingModel = require('../models/courseTracking');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  console.log(req.body);
  const courseTracking = new CourseTrackingModel({
    courseId: req.body.courseId,
    userId: req.userData.userId,
    status: "ACTIVE",
    courseName: req.body.courseName,
    program: req.body.program,
    term: req.body.term,
    credits: req.body.credits,
    grade: '',
    scheduleTime: req.body.scheduleTime

  });
  courseTracking.save().then(
    createdCourseTracking => {
      res.status(201).json({
        message: 'success',
        courseTrackingId: createdCourseTracking._id,
        courseName: createdCourseTracking.courseName
      })
    }
  )
});

router.get("", checkAuth, (req, res, next) => {
  const userId = req.userData.userId;
  console.log("1")
  console.log(userId)
  CourseTrackingModel.find({'userId':userId}).exec(
    function(err, docs) {
      if (err) return console.error(err);
      console.log(docs);
      res.status(200).json({
        message: 'post success',
        courseTrackings: docs
      });
    });
});

router.get("/:courseId", checkAuth, (req, res, next) => {
  const userId = req.userData.userId;
  CourseTrackingModel.find({'userId':userId, 'courseId':req.params.courseId}).exec(
    function(err, docs) {
      if (err) return console.error(err);
      console.log(docs);
      res.status(200).json({
        courseTracking: docs
      });
    });
});

module.exports = router;
