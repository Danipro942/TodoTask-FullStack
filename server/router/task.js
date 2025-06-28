const express = require("express");
const { body } = require("express-validator");
const taskController = require("../controller/task");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post(
  "/create-task",
  isAuth,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Title must be between 3 and 30 characters"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 3, max: 100 })
      .withMessage("Description must be between 3 and 30 characters"),
  ],

  taskController.createTask
);

router.get("/", isAuth, taskController.getTasks);
router.delete("/tasks/:taskId", isAuth, taskController.deleteTask);
router.put("/update-task/:taskId", isAuth, taskController.updateState);

module.exports = router;
