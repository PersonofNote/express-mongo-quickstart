const mongoose = require("mongoose");

const Mood = mongoose.model(
  "Mood",
  new mongoose.Schema({
    value: {
        type: String,
        required: [true, 'Value is required']
    },
    note: {
        type: String
    },
    user_id: {
        type: String,
        required: [true, '']
    },
  },
  { timestamps: true })
);

module.exports = Mood;