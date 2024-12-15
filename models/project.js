const mongoose = require("mongoose");

const projects = new mongoose.Schema(
  {
    groupMembers: {
      type: Array,
      required: true,
    },
    ProjectTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);
const project = mongoose.model("project", projects)

module.exports = {
  project
}