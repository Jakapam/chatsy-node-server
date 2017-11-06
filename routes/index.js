const languagesController = require('../controllers').languages;
const usersController = require('../controllers').users;

module.exports = (app) => {
  app.get('/languages', languagesController.list)
  app.get('/user', usersController.getUser)
  app.post('/users', usersController.create)
  app.post('/login', usersController.login)
};
