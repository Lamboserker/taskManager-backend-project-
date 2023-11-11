import express from "express";
import Task from "../models/Tasks.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Public
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/tasks
// @desc    Create a new task
// @access  Public
router.post("/", auth, async (req, res) => {
  const { authorOfTask, task } = req.body;
  console.log(req.body);
  console.log(req.user.id);
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newTask = new Task({
      authorOfTask: user.name,
      task,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    // Finden des Tasks und Prüfen, ob er existiert
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Löschen des gefundenen Tasks
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PATCH api/tasks/:id
// @desc    Update a task
// @access  Public
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Stellen Sie sicher, dass nur änderbare Felder aktualisiert werden
    task.task = req.body.task || task.task;
    task.solved = req.body.solved !== undefined ? req.body.solved : task.solved;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
