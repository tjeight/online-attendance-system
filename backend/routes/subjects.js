// routes/subjects.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subject = require('../models/subject');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/subjects - Fetching all subjects');
    const subjects = await Subject.find();
    console.log(`Found ${subjects.length} subjects`);
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`GET /api/subjects/${req.params.id} - Fetching subject by ID`);
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (err) {
    console.error('Error fetching subject by ID:', err);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
});

module.exports = router;
