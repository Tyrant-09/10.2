const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
  });
  res.json(post);
});

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username')
    .populate('comments.user', 'username');
  res.json(post);
});

router.post('/:id/comments', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();
  res.json(post);
});

module.exports = router;
