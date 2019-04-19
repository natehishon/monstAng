const mongoose = require('mongoose');

const courseTrackingSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  course: {type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
  status: {type: String, required: true}
});

module.exports = mongoose.model('CourseTracking', courseTrackingSchema);
