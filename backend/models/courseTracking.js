const mongoose = require('mongoose');

const courseTrackingSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
  status: {type: String, required: true},
  courseName: {type: String, required: true}
});

module.exports = mongoose.model('CourseTracking', courseTrackingSchema);
