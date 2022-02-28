const express=  require('express');
const router = express.Router();
const passport=require('passport')
const catchAsync =require('../utils/catchAsync');
const user=require('../controllers/user')
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage })
router.route('/register')
    .get(catchAsync(user.renderRegister))
    .post(upload.array('image'),catchAsync(user.register))

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login)

router.get('/logout',catchAsync(user.logout))
module.exports=router