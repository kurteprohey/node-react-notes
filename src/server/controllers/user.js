const _ = require('lodash');
const {mongoose} = require('../db/mongoose');
const {User} = require('../models/user');
const {Document} = require('../models/document');

exports.register = (req, res) => {
  var userData = _.pick(req.body, ['email', 'password']);
  var user = new User(userData);
  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send({user});
    })
    .catch((err) => {
      res.status(400).send();
    });
}

exports.me = (req, res) => {
  res.send({user: req.user});
}

exports.login = (req, res) => {
  const {email, password} = req.body;
  User.findByCredentials(email, password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send({user});
      });
    })
    .catch((err) => res.status(400).send());
}

exports.deleteToken = (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send({});
    })
    .catch(() => {
      res.status(400).send();
    });
};

exports.getWorkspace = (req, res) => {
  const documentId = req.params.id;
  const userId = req.user._id;
  // get specific documents
  Document.find({userId})
    .then((documents) => {
      res.send({
        self: null,
        children: documents
      });
    })
    .catch((err) => res.status(400).send());
}
