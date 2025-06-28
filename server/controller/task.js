const JWT = require("jsonwebtoken");

const Task = require("../models/task");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  const error = new Error();
  if (!errors.isEmpty()) {
    const error = Error("Validation Failed");
    error.statusCode = 422;
    return next(error);
  }

  const { title, description } = req.body;

  const findID = await User.findById(req.userId);
  if (!findID) {
    error.message = "User not found";
    error.statusCode = 404;
    return next(error);
  }

  const task = new Task({
    title,
    description,
    creatorId: req.userId,
    status: false,
  });
  try {
    await task.save();
  } catch (error) {
    error.message = "Something went wrong creating the task";
    next(error);
  }
  console.log(task);
  res.status(201).json({
    message: "Task created",
    task,
  });
};

exports.getTasks = async (req, res, next) => {
  const error = new Error();

  const currentPage = req.query.page || 1;
  const status = req.query.status || false;
  console.log(status);
  if (!status) {
    error.message = "Status is required";
    error.statusCode = 422;
    console.log(error);
    return next(error);
  }

  console.log(req.query.page);
  const perPage = 5;
  let totalItems;
  try {
    const count = await Task.find({
      creatorId: req.userId,
      status: status,
    }).countDocuments();
    totalItems = count;
    const TaskList = await Task.find({ creatorId: req.userId, status: status })
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    if (!TaskList) {
      error.message = "No task found";
      error.statusCode = 404;
      return next(error);
    }
    res.status(202).json({
      TaskList,
      totalItems: count,
    });
  } catch (error) {
    error.message = "Something went wrong getting the task";
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  const error = new Error();
  const { taskId } = req.params;

  const findTask = await Task.findOneAndDelete({
    _id: taskId,
    creatorId: req.userId,
  });

  if (!findTask) {
    error.message = "Task not found";
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    message: "Task deleted",
  });
};

exports.updateState = async (req, res, next) => {
  const error = new Error();
  const { taskId } = req.params;
  console.log(taskId);
  try {
    const findTask = await Task.findOne({ _id: taskId, creatorId: req.userId });
    console.log(req.userId);

    if (!findTask) {
      error.message = "Task not found";
      error.statusCode = 404;
      return next(error);
    }

    await Task.findOneAndUpdate(
      { _id: taskId, creatorId: req.userId },
      { status: !findTask.status }
    );
    res.status(200).json({
      message: "Task updated it",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
