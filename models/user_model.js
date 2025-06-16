const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
 {
  name: String,

  email: { type: String, unique: true },

  password: String,

  role: { type: String, enum: ['admin', 'user'], default: 'user' },

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);