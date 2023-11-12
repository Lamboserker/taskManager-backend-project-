import mongoose from "mongoose";

const { Schema } = mongoose; // Importing Schema from mongoose

const TaskSchema = new Schema({
  authorOfTask: {
    type: String,
    required: true,
  },
  solved: {
    type: Boolean,
    default: false,
  },
  
  task: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", TaskSchema); // Creating the Task model

export default Task;
