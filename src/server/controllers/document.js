const _ = require('lodash');
const {ObjectId} = require('mongodb');
const {mongoose} = require('../db/mongoose');
const {Document} = require('../models/document');
const {User} = require('../models/user');

exports.get = (req, res) => {
  const documentId = req.params.id;
  const userId = req.user._id;
  console.log('getting the doc');
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

exports.delete = (req, res) => {
  const documentId = req.params.id;
  Document.aggregate([
    {
      $graphLookup: {
        from: "documents",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentId",
        as: "children"
      }
    },
    {
      $match: { _id: new ObjectId(documentId) }
    }
  ]).then((docs) => {
    const doc = docs[0];
    const childrenIds = doc.children.map(child => child._id);
    const ids = [doc._id].concat(childrenIds);
    Document.deleteMany({'_id':{'$in':ids}})
      .then((removed) => {
        res.send({rootId: doc._id});
      });
  });
}

exports.create = (req, res) => {
  const userId = req.user._id;
  const documentToInsert = _.pick(req.body, ['name', 'type', 'parentId', 'content', 'tags']);
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
  const documentToUpdate = _.pick(req.body, ['name', 'content', 'tags']);
  Document
    .findOneAndUpdate({_id: documentId}, {$set: documentToUpdate}, {new: true})
    .then((document) => {
      res.send(document);
    })
    .catch((err) => res.send(400));
};
