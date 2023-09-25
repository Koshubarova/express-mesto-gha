const router = require('express').Router();

const { getCards, addCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', addCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;