const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');

// All project routes require authentication
router.use(authMiddleware);

// ─── Projects ─────────────────────────────────────────────────────────────────

// GET /api/projects — get all projects owned by the logged-in user, each with its tasks
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.userId }).sort({ createdAt: -1 });

    // Fetch all tasks for these projects in one query, then group by project
    const projectIds = projects.map((p) => p._id);
    const allTasks = await Task.find({ project: { $in: projectIds } }).sort({ createdAt: -1 });

    const tasksByProject = allTasks.reduce((acc, task) => {
      const key = task.project.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});

    const result = projects.map((p) => ({
      ...p.toObject(),
      tasks: tasksByProject[p._id.toString()] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/projects — create a new project
router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Project name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      const project = await Project.create({
        name,
        description: description || '',
        owner: req.userId,
      });
      res.status(201).json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/projects/:id — get a single project with its tasks
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.id }).sort({ createdAt: -1 });
    res.json({ ...project.toJSON(), tasks });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Tasks ────────────────────────────────────────────────────────────────────

// GET /api/projects/:projectId/tasks — get all tasks for a project
router.get('/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/projects/:projectId/tasks — create a task in a project
router.post(
  '/:projectId/tasks',
  [body('title').trim().notEmpty().withMessage('Task title is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const { title, description, status, priority, dueDate } = req.body;

      const task = await Task.create({
        title,
        description: description || '',
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate || null,
        project: req.params.projectId,
      });

      res.status(201).json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT /api/projects/:projectId/tasks/:taskId — update a task
router.put('/:projectId/tasks/:taskId', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, project: req.params.projectId },
      { title, description, status, priority, dueDate: dueDate || null },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/projects/:projectId/tasks/:taskId — delete a task
router.delete('/:projectId/tasks/:taskId', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
