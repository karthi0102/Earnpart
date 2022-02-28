if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const multer  = require('multer')
const {storage}=require('./cloudinary')
const upload = multer({storage })
const express = require('express');
const app = express();
const ejsMate=require('ejs-mate')
const path=require('path');
const User= require('./model/user')
const Task = require('./model/tasks')
const passport=require('passport');
const Skill = require('./model/skill')
const ExpressError=require('./utils/ExpressError')
const flash = require('connect-flash')
const Feeds=require('./routes/feed');
const Reviews=require('./routes/review');
const userRoute=require('./routes/user');
const LocalStrategy=require('passport-local')
const mongoose=require('mongoose')
const session = require('express-session');
const methodOverride=require('method-override')
mongoose.connect('mongodb://localhost:27017/EarnPart',{useNewUrlParser:true,useUnifiedTopology:true})
.then( () => {
    console.log("Connection open")
}).catch(err => {
    console.log("OOPS !! ERROR")
})
app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(flash())
app.use(express.static(path.join(__dirname,'public')));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
const sessionConfig = {
    secret:'thisisagoodsecret',
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*32*7,
        maxAge:1000*60*60*32*7,
    }
}
app.use(session(sessionConfig))
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/',userRoute)
app.use('/earn',Feeds)
app.use('/earn/:id/reviews',Reviews)



app.get('/account',async(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must login first')
        return res.redirect('/login');
    }
    const id = req.user._id;
    const user = await User.findById(id).populate({path:'skill',populate:{path:'author'}}).populate('feeds').populate({path:'task',populate:{path:'author'}}).populate('given')
    res.render('mine.ejs',{user})
})

app.get('/account/:id',async(req,res)=>{
    const {id}=req.params;
    const user =await User.findById(id).populate('skill').populate('feeds');
    res.render('account.ejs',{user})
})
app.get('/check',async(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must login first')
        return res.redirect('/login');
    }
    const id = req.user._id;
    const user = await User.findById(id);
    res.render('check.ejs',{user})
})
app.get('/sortUser',async(req,res)=>{
    const {username} = req.body;
    const user =  await User.find(username);
   res.redirect(`/account/${user._id}`)
})
app.post('/earn/:id/skills',async(req,res)=>{
    const {id} = req.params;
    const user =await User.findById(id);
    const newSkill = new Skill(req.body.skills);
    user.skill.push(newSkill);
    newSkill.author=req.user._id;
    await newSkill.save();
    await user.save();
    req.flash('success','Skill is been added');
    res.redirect( '/account');
})

app.get('/tasks',async(req,res)=>{
    const tasks = await Task.find({})
    res.render('task.ejs',{tasks})
})
app.get('/tasks/new',async(req,res)=>{
    res.render('newTask.ejs')
})
app.get('/tasks/:taskId',async(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must login first')
        return res.redirect('/login');
    }
    const id=req.user._id;
    const {taskId}=req.params;
    const task = await Task.findById(taskId).populate('author').populate('applier');
    res.render('tasksShow.ejs',{task,id})
})
app.post('/tasks',upload.array('image'),async(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must login first')
        return res.redirect('/login');
    }
    const id=req.user._id;
    const user = await User.findById(id);
    const task = new Task(req.body.task);
    task.image= req.files.map(f=>({url:f.path,filename:f.filename}))
    task.progress=0;
    task.author=req.user._id;
    user.task.push(task);
    await task.save();
    await user.save()
    console.log(task)
    req.flash('success','Successfully Post is created')
    res.redirect(`/tasks`)
})
app.get('/apply/:taskId/hire/:applyId',async (req,res)=>{
    const {taskId,applyId} = req.params
    const task = await Task.findById(taskId);
    task.applier.push(applyId);
    await task.save();
    req.flash('success','You have successfully applied')
    res.redirect('/tasks')
    
})
app.get('/progress/:id',async(req,res)=>{
    const {id}=req.params;
    const task = await Task.findById(id);
    task.progress+=1;
    if(task.progress>3){
        task.progress=4;
    }
    console.log(task.progress)
    await task.save();
    res.redirect(`/tasks/${id}`);

})
app.get('/application/:id',async(req,res)=>{
    const {id} = req.params;
    const task = await Task.findById(id).populate('applier');
    res.render('applications.ejs',{task})
})
app.get('/map',async (req,res)=>{
    const user= await User.find({})
    res.render('map.ejs',{user})
})
app.get('/hired/:id/:taskId',(req,res)=>{
    const {id,taskId}= req.params
    res.render('hireForm.ejs',{id,taskId})
})
app.post('/hired/:id/:taskId',async(req,res)=>{
    const {id,taskId}=req.params;
    const {guide}  = req.body;
    const user = await User.findById(id);
    const task = await Task.findById(taskId);
    task.guide=guide;
    task.progress=0;
    console.log(task)
    user.given.push(task);
    await task.save();
    await user.save();
    req.flash('success','message is sent to the user');
    res.redirect('/earn');
})
app.get('/progress',(req,res)=>{
    res.render("progress")
})
app.get('/sortskill/:body',async(req,res)=>{
    const {body} = req.params;
    const skill =  await Skill.find({body}).populate('author');
    const arr=[]
    for(let s of skill){
        arr.push(s.author)
    }
    let uniqueProfile = [...new Set(arr)]
    res.render('skill.ejs',{uniqueProfile})
})
app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next) => {
    const {statusCode=500} = err;
    if(!err.message) err.message='something went wrong';
    res.status(statusCode).render('error.ejs',{err});
})
app.listen(8080,()=>{
    console.log('Server running on port 8080')
})