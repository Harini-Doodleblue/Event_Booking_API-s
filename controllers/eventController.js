const Event = require('../models/event_model');

exports.createEvent = async (req, res) => {
  const event = await Event.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(event);
};

exports.getNearbyEvents = async (req, res) => {
  const { coordinates } = req.body;
  const events = await Event.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: 30000
      }
    }
  });
  res.json(events);
};

exports.participateInEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  // Checking overlapping
  const overlapping = await Event.find({
    participants: { $elemMatch: { userId: req.user.id, status: 'going' } },
    $or: [
      { startTime: { $lt: event.endTime, $gte: event.startTime } },
      { endTime: { $gt: event.startTime, $lte: event.endTime } }
    ]
  });

  if (overlapping.length) return res.status(400).json({ msg: 'Overlapping event' });

  event.participants.push({ userId: req.user.id });
  await event.save();
  res.json({ msg: 'Joined event' });
};

exports.cancelParticipation = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const startTime = new Date(event.startTime);
  const now = new Date();
  const hoursLeft = (startTime - now) / (1000 * 60 * 60);

  if (hoursLeft < 8) return res.status(400).json({ msg: 'Cannot cancel within 8 hours' });

  event.participants = event.participants.map(p =>
    p.userId.equals(req.user.id) ? { ...p.toObject(), status: 'canceled' } : p
  );
  await event.save();
  res.json({ msg: 'Cancelled participation' });
};

exports.getParticipants = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('participants.userId', 'name email');
  res.json(event.participants);
};
