const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUsers, getUserById, getUserMe, editUser, editUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), getUserById);

router.get('/me', getUserMe);

// router.post('/users', addUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),

}), editUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),

  }),
}), editUserAvatar);

module.exports = router;
