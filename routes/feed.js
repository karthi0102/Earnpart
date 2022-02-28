const express = require('express');
const router = express.Router();
const catchAsync =require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware');
const feeds = require('../controllers/feed')
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage })

router.route('/')
        .get(catchAsync(feeds.indexPage))
        .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(feeds.newPost))
router.get('/new',isLoggedIn,catchAsync(feeds.renderNewForm))

router.route('/:id')
      .get(catchAsync(feeds.showPost))
      .put(isLoggedIn,isAuthor,validateCampground,catchAsync(feeds.updatePost))
      .delete(isLoggedIn,isAuthor,catchAsync(feeds.deletePost))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(feeds.editPost))

module.exports=router;