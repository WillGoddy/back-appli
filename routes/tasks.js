const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// Créer une tâche
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, deadline } = req.body;

  try {
    const newTask = new Task({
      userId: req.user.userId,
      title,
      description,
      deadline,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les tâches avec filtres, recherche et tri
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, search, sort, order } = req.query;

    let filter = { userId };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOption[sort] = sortOrder;
    }

    const tasks = await Task.find(filter).sort(sortOption);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour une tâche
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une tâche
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
