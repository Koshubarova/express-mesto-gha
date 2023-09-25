const router = require('express').Router();

const {
  getUsers, getUserById, addUser, editUser, editUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', addUser);

router.patch('/users/me', editUser);

router.patch('/users/me/avatar', editUserAvatar);

module.exports = router;
