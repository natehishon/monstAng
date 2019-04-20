const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  name: {type: String, required: true },
  description: {type: String, required: true },
  startDate: {type: String},
  endDate: {type: String},
  program: {type: String}
});

module.exports = mongoose.model('Course', courseSchema);
