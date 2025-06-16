const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
 {
  title: String,

  description: String,

  startTime: Date,

  endTime: Date,

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },

  capacity: Number,

  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['going', 'cancelled'], default: 'going' }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

EventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', EventSchema);
