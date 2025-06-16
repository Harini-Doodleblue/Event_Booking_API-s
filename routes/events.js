const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/role')('admin');

const 
{
  createEvent,
  getNearbyEvents,
  participateInEvent,
  cancelParticipation,
  getParticipants
} = require('../controllers/eventController');

router.post('/', auth, isAdmin, createEvent);
router.post('/nearby', auth, getNearbyEvents);
router.post('/:id/participate', auth, participateInEvent);
router.delete('/:id/leave', auth, cancelParticipation);
router.get('/:id/participants', auth, getParticipants);

module.exports = router;
