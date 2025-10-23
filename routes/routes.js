const express = require('express');
const router = express.Router();
const axios = require('axios');
const Request = require('../models/Request');
const Collection = require('../models/collection');

// Make API Request
router.post('/request', async (req, res) => {
  const { method, url, headers, body, params } = req.body;
  
  try {
    // Validate inputs
    if (!method || !url) {
      return res.status(400).json({ error: 'Method and URL are required' });
    }

    const startTime = Date.now();
    
    // Prepare axios config
    const config = {
      method: method.toLowerCase(),
      url,
      headers: headers || {},
      params: params || {},
      validateStatus: () => true,
      timeout: 30000 // 30 second timeout
    };

    // Add body for POST, PUT, PATCH
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && body) {
      config.data = body;
    }

    const response = await axios(config);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Save to history
    const requestRecord = new Request({
      method,
      url,
      headers,
      body,
      params,
      response: response.data,
      statusCode: response.status,
      responseTime
    });
    await requestRecord.save();

    res.json({
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      responseTime,
      historyId: requestRecord._id
    });

  } catch (error) {
    console.error('Error in /request:', error); // Add logging
    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'Network error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get Request History
router.get('/history', async (req, res) => {
  try {
    const history = await Request.find().sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete History Item
router.delete('/history/:id', async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all history
router.delete('/history', async (req, res) => {
  try {
    await Request.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Collections CRUD
router.get('/collections', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/collections', async (req, res) => {
  try {
    const collection = new Collection(req.body);
    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/collections/:id', async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;