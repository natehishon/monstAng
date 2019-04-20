const express = require('express');
const CourseModel = require('../models/course');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const course = new CourseModel({
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    program: req.body.program
  });
  course.save().then(
    createdCourse => {
      res.status(201).json({
        message: 'success',
        courseId: createdCourse._id
      })
    }
  )
});

router.put("/:id", checkAuth, (req, res, next) => {
  const course = new CourseModel({
    _id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    program: req.body.program
  })
  CourseModel.updateOne({_id: req.params.id}, course).then(result => {
    console.log("updated");
    res.status(200).json({ message: 'update success'})
  });
});

router.get("", (req, res, next) => {
  CourseModel.find().then(documents => {
    res.status(200).json({
      message: 'post success',
      courses: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  CourseModel.findById(req.params.id).then(course => {
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({message: 'Course Not Found'});
    }
  })
});

router.delete("/:id", checkAuth, (req, res, next) => {
  CourseModel.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'deleted'});
  });

});



module.exports = router;
