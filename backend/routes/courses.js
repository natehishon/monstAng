const express = require('express');
const CourseModel = require('../models/course');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const course = new CourseModel({
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    program: req.body.program,
    scheduleTime: req.body.scheduleTime,
    credits: req.body.credits,
    term: req.body.term
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
    program: req.body.program,
    scheduleTime: req.body.scheduleTime,
    credits: req.body.credits,
    term: req.body.term
  })
  CourseModel.updateOne({_id: req.params.id}, course).then(result => {
    res.status(200).json({message: 'update success'})
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const searchValue = req.query.searchValue.toString();
  var query = {$or:[{name:{$regex: searchValue, $options: 'i'}},
      {program:{$regex: searchValue, $options: 'i'}}, {term:{$regex: searchValue, $options: 'i'}}]}
  ;
  const courseQuery = CourseModel.find(query);
  let fetchedCourses;

  if (pageSize && currentPage) {
    courseQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }


  courseQuery.then(documents => {
    fetchedCourses = documents;


    if(fetchedCourses.length < 5){
      return fetchedCourses.length;
    }

    return CourseModel.count();
  })
    .then(count => {
      res.status(200).json({
        message: "Courses fetched",
        courses: fetchedCourses,
        maxCourses: count
      })

      }
    );
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
    res.status(200).json({message: 'deleted'});
  });

});


module.exports = router;
