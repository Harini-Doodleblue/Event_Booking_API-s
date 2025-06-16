const Event = require('../models/event_model');

exports.getUserEvents = async (req, res) => {
  const now = new Date();
  const type = req.params.type;

  let query;
  if (type === 'past') query = { endTime: { $lt: now } };
  else if (type === 'current') query = { startTime: { $lte: now }, endTime: { $gte: now } };
  else if (type === 'future') query = { startTime: { $gt: now } };
  else return res.status(400).json({ msg: 'Invalid event type' });

  const events = await Event.find({
    'participants.userId': req.user.id,
    ...query
  }).sort({ startTime: -1 });

  res.json(events);
};
