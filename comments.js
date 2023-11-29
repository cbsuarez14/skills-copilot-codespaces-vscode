// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// Create web server
const app = express();

// Allow cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Store comments
const commentsByPostId = {};

// Handle GET requests to /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// Handle POST requests to /posts/:id/comments
app.post('/posts/:id/comments', async (req, res) => {
    const { content } = req.body;

    // Get comments for this post
    const comments = commentsByPostId[req.params.id] || [];

    // Generate ID for new comment
    const id = Math.floor(Math.random() * 999999);

    // Add comment to array
    comments.push({ id, content, status: 'pending' });

    // Store comments
    commentsByPostId[req.params.id] = comments;

    // Send event to Event Bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: { id, content, postId: req.params.id, status: 'pending' },
    });

    // Send response
    res.status(201).send(comments);
});

// Handle POST requests to /events
app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { id, content, postId, status } = data;

        // Get comments for this post
        const comments = commentsByPostId[postId];

        // Find comment with matching ID
        const comment = comments.find((comment) => {
            return comment.id === id;
        });

        // Update status
        comment.status = status;

        // Send event to Event Bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: { id, content, postId, status },
        });
    }

    // Send response
    res.send({});
});

// Listen for requests
app.listen(4001