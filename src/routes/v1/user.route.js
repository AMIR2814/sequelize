const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const { userController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser)
  ;


  router
  .route('/:id')
  .post(userController.updateUser)
  .delete(userController.deleteUser)
  ;


module.exports = router;