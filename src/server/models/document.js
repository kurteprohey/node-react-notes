const _ = require('lodash');
const mongoose = require('mongoose');
// const validator = require('validator');

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  type: {
    type: String,
    trim: true,
    minlength: 1
  },
  content: {
    type: String
  },
  // for root of trees
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
  parentId: {
    // required for all nodes except direct children of user's workspace
    type: mongoose.Schema.Types.ObjectId
  }
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = {
  Document
};
