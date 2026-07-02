const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },

  profile: {
    name: String,
    profession: String,
    goal: String,
    experience: String,
  },

  preferences: {
    language: String,
    responseStyle: String,
  },

  summary: String,
});

module.exports = mongoose.model("Memory", memorySchema);