const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getUserEvents } = require('../controllers/userController');

router.get('/events/:type', auth, getUserEvents); // type as past, current, future

module.exports = router;
