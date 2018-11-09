const {ObjectId} = require('mongodb');
const {User} = require('./../../models/user');
const {Document} = require('./../../models/document');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const documentOneId = new ObjectId();
const documentTwoId = new ObjectId();
const documentThreeId = new ObjectId();

const users = [
  {
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];

const documents = [
  // child document
  {
    _id: documentOneId,
    type: 'folder',
    name: 'folder of user 1',
    userId: userOneId
  },
  {
    _id: documentThreeId,
    type: 'file',
    name: 'first file of folder one',
    parentId: documentOneId
  },
  {
    _id: documentTwoId,
    type: 'folder',
    name: 'folder of user 2',
    userId: userTwoId
  },
];

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

const populateDocuments = (done) => {
  Document.remove({})
    .then(() => {
      var docOne = new Document(documents[0]).save();
      var docTwo = new Document(documents[1]).save();
      var docThree = new Document(documents[2]).save();
      return Promise.all([docOne, docTwo, docThree]);
    })
    .then(() => done());
};

module.exports = {
  documents,
  populateDocuments,
  users,
  populateUsers
};