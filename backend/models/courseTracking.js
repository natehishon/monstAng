const mongoose = require('mongoose');

const courseTrackingSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
  courseName: {type: String, required: true},
  status: {type: String, required: true},
  term: {type: String, required: true},
  credits: {type: Number, required: true},
  program: {type: String, required: true},
  scheduleTime: {type: String},
  grade: {type: String}
});

module.exports = mongoose.model('CourseTracking', courseTrackingSchema);
