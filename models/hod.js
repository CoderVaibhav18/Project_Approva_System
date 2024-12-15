const mongoose = require("mongoose");


const hodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const hod = mongoose.model("hod", hodSchema);

module.exports = {
  hod
}