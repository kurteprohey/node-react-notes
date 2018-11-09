const _ = require('lodash');
const {mongoose} = require('../db/mongoose');
const {Document} = require('../models/document');
const {User} = require('../models/user');

exports.get = (req, res) => {
  const documentId = req.params.id;
  const userId = req.user._id;
  User.hasAccessToDocument(userId, documentId)
    .then(() => {
      Document
        .find({
          $or: [
            {'_id': documentId},
            {parentId: documentId},
          ]
        })
        .then((documents) => {
          const children = documents.filter((doc) => doc.parentId == documentId);
          const self = documents.filter((doc) => doc._id == documentId)[0];
          res.send({self, children});
        })
        .catch((err) => res.status(400).send());
    })
  .catch((err) => res.status(404).send());
};

exports.create = (req, res) => {
  const userId = req.user._id;
  let documentToInsert = _.pick(req.body, ['name', 'type', 'parentId', 'content']);
  if (!documentToInsert.parentId) {
    documentToInsert.userId = userId;
  }
  new Document(documentToInsert)
    .save()
    .then((document) => {
      res.send(document);
    })
    .catch((err) => res.send(400));
};

exports.update = (req, res) => {
  const userId = req.user._id;
  const documentId = req.params.id;
  let documentToUpdate = _.pick(req.body, ['name', 'content']);
  Document
    .findOneAndUpdate({_id: documentId}, {$set: documentToUpdate}, {new: true})
    .then((document) => {
      res.send(document);
    })
    .catch((err) => res.send(400));
};