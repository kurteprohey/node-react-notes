const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {Document} = require('./document');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

// defining instance methods
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens = user.tokens.concat([{access, token}]);
  return user.save().then(() => {
    return token;
  })
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
}

// model method
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(err) {
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;
  return User.findOne({email})
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, isCorrect) => {
          if (isCorrect) {
            return resolve(user);
          }
          return reject();
        });
      });
      
    });
}

UserSchema.statics.hasAccessToDocument = function(userId, documentId) {
  return new Promise((resolve, reject) => {
    Document.aggregate([
      {
        $graphLookup: {
          from: "documents",
          startWith: "$parentId",
          connectFromField: "parentId",
          connectToField: "_id",
          as: "parents"
        }
      }
    ]).then((docs) => {
      const currectDoc = docs.filter(doc => doc._id == documentId)[0];
      if (!currectDoc) {
        return reject();
      }
      let treeRootUserId;
      if (!currectDoc.userId) {
        // find parent with userId field to check rights
        const treeRoot = currectDoc.parents.filter(parent => parent.userId)[0];
        treeRootUserId = treeRoot.userId;
      } else {
        treeRootUserId = currectDoc.userId;
      }
      if (treeRootUserId.toString() == userId.toString()) {
        return resolve();
      } else {
        return reject();
      }
    });
  });
}

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};