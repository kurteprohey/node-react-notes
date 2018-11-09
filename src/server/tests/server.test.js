const request = require('supertest');
const expect = require('expect');
const {ObjectId} = require('mongodb');

const {app} = require('../index');
const {User} = require('../models/user');
const {Document} = require('../models/document');
const {users, populateUsers, documents, populateDocuments} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateDocuments);

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/api/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.user._id).toBe(users[0]._id.toHexString());
        expect(res.body.user.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if not authenticated', (done) => {
    // without token
    // body is equal to an empty object
    // use toEqual
    request(app)
      .get('/api/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = '123mbd';
    request(app)
      .post('/api/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.user._id).toBeTruthy();
        expect(res.body.user.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then(
          (user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          }
        ).catch((e) => done(e));
      });
  });
  it('should return validation errors if request is invalid', (done) => {
    // expect 400 to come back
    const email = 'dasd@';
    const password = 'd';
    request(app)
      .post('/api/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
  it('should not create a user if email in use', (done) => {
    // email from the seed data
    // expect 400 to come back
    const email = users[0].email.toString();
    const password = '232234fsd';
    request(app)
      .post('/api/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  
  it('should login user and return a token', (done) => {
    const {email, password, _id} = users[1];
    request(app)
      .post('/api/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(_id)
          .then((user) => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch((e) => done(e));
      });
  });
  it('should reject invalid login', (done) => {
    const {email, _id} = users[1];
    const password = 'boom';
    request(app)
      .post('/api/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(_id)
          .then((user) => {
            expect(user.tokens.length).toEqual(1);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // make delete request
    // set x-auth equal to token
    // 200 back
    // find user in db
    // tokens array has length of 0
    const token = users[0].tokens[0].token;
    const userId = users[0]._id;
    request(app)
      .delete('/api/users/me/token')
      .set('x-auth', token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(userId)
          .then((user) => {
            expect(user.tokens.length).toEqual(0);
            done();
          })
          .catch((err) => done(err));
      });
  });
});

// document tests
describe('GET /documents', () => {
  // should get user workspace top level items
  it('should get user top level tree', (done) => {
    request(app)
      .get('/api/users/workspace')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.self).toBeFalsy();
        expect(res.body.children.length).toEqual(1);
        expect(res.body.children[0]._id.toString()).toEqual(documents[0]._id.toString());
      })
      .end(done);
  });
});

describe('GET /documents/id', (done) => {
  it('should return 404 if document is not found', (done) => {
    request(app)
      .get(`/api/documents/${new ObjectId().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return 404 for non object id', (done) => {
    request(app)
      .get(`/api/documents/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return a document and its children', (done) => {
    request(app)
      .get(`/api/documents/${documents[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.self._id.toString()).toBe(documents[0]._id.toString());
        expect(res.body.children.length).toEqual(1);
        expect(res.body.children[0]._id.toString()).toEqual(documents[1]._id.toString());
      })
      .end(done);
  });
  it('should not return a document created by other user', (done) => {
    request(app)
      .get(`/api/documents/${documents[2]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('POST /documents', () => {
  it('should create a new folder of user workspace', (done) => {
    const name = 'Test folder name';
    const type = 'folder';
    const userId = users[0]._id;
    request(app)
      .post('/api/documents')
      .set('x-auth', users[0].tokens[0].token)
      .send({type, name, userId})
      .expect(200)
      .expect((res) => {
        expect(res.body.userId.toString()).toBe(userId.toString());
      })
      .end(done);
  });
  it('should create a new folder as a child of existing folder', (done) => {
    const name = 'Test folder name';
    const type = 'folder';
    const parentId = documents[0]._id;
    request(app)
      .post('/api/documents')
      .set('x-auth', users[0].tokens[0].token)
      .send({type, name, parentId})
      .expect(200)
      .expect((res) => {
        expect(res.body.parentId.toString()).toBe(parentId.toString());
      })
      .end(done);
  });
});
