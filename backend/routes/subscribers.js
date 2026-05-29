const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const subscriberController = require('../controllers/subscriberController');

router.post('/', subscriberController.subscribe);
router.get('/', protect, adminOnly, subscriberController.getSubscribers);
router.delete('/:id', protect, adminOnly, subscriberController.deleteSubscriber);

module.exports = router;
