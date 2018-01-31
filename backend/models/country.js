const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  slug: String,
  latitude: Number,
  longitude: Number,
  name: String
});

const Country = mongoose.model('Country', schema);

module.exports = exports = Country;
