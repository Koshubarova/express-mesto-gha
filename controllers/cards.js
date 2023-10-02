const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch((err) => {
          if (err.name === 'DocumentNotFoundError') {
            res.status(404).send({ message: 'Карточка не найдена' });
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        // throw new forbiddenError('Карточка другого пользователя');
        res.status(403).send({ message: 'Карточка другого пользователя' });
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => {
          res.send({ message: 'Карточка успешно удалена' });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({ message: 'Некорректный запрос' });
          } else if (err.name === 'DocumentNotFoundError') {
            res.status(404).send({ message: 'Карточка не найдена' });
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный запрос' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный запрос' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        next(err);
      }
    });
};
