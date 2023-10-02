const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../utils/constants');

const {
  getUsers, getUserMe, getUserById, editUser, editUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getUserMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

// router.post('/users', addUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),

}), editUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regexUrl),
  }),
}), editUserAvatar);

module.exports = router;
