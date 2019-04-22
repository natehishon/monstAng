const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  name: {type: String, required: true },
  description: {type: String, required: true },
  startDate: {type: String},
  endDate: {type: String},
  scheduleTime: {type: String},
  term: {type: String},
  credits: {type: Number},
  program: {type: String}
});

module.exports = mongoose.model('Course', courseSchema);
