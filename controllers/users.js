const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        // NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        'secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: true,
      });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
      // next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный запрос' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Ошибка валидации' });
        } else if (err.name === 'DocumentNotFoundError') {
          res.status(404).send({ message: 'Пользователь не найден' });
        } else {
          next(err);
        }
      });
  } else {
    next();
  }
};

module.exports.editUserAvatar = (req, res, next) => {
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Ошибка валидации' });
        } else if (err.name === 'DocumentNotFoundError') {
          res.status(404).send({ message: 'Пользователь не найден' });
        } else {
          next(err);
        }
      });
  } else {
    next();
  }
};
