const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { updateUser, getUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
