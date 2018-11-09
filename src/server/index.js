if (process.env.NODE_ENV === 'test') {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/NotesAppTest';
} else {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/NotesApp';
}
process.env.JWT_SECRET = 'ad32wd32d34r3d23d';

const express = require('express');
const os = require('os');
const {mongoose} = require('./db/mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cors = require('cors');
// import middlewares
const {authenticate} = require('./middleware/authenticate');
// import controllers
const userController = require('./controllers/user');
const documentController = require('./controllers/document');

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(cors({exposedHeaders: ['Content-Length', 'x-auth']}));

// user routes
app.get('/api/users/me', authenticate, userController.me);
app.post('/api/users', userController.register);
app.post('/api/users/login', userController.login);
app.delete('/api/users/me/token', authenticate, userController.deleteToken);
app.get('/api/users/workspace', authenticate, userController.getWorkspace);

// GET document and its children
app.get('/api/documents/:id', authenticate, documentController.get);
app.post('/api/documents', authenticate, documentController.create);
app.put('/api/documents/:id', authenticate, documentController.update);

app.listen(8080, () => console.log('Listening on port 8080!'));

module.exports = {app};