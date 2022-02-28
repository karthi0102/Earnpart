const Feed = require('../model/feed')
const User = require('../model/user')
const Skill =require('../model/skill')
const {cloudinary} = require('../cloudinary')
const mbxGecoding= require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGecoding({accessToken:mapBoxToken})
module.exports.indexPage=async(req,res)=>{
    const feeds= await Feed.find({}).populate('author');
    const skills = await Skill.find({})
    const arr=[]
    for(let s of skills){
        arr.push(s.body)
    }
    let uniqueSkills = [...new Set(arr)]
    res.render('index.ejs',{feeds,uniqueSkills})
}

module.exports.renderNewForm = async(req,res)=>{
    res.render('new.ejs')
}

module.exports.newPost=async (req,res,next) => {
    const geoData= await geocoder.forwardGeocode({
        query:req.body.feeds.location,
        limit:1,
    }).send()
    const id=req.user._id;
    const user = await User.findById(id);
    const newFeed= new Feed(req.body.feeds);
    newFeed.geometry=geoData.body.features[0].geometry;
    newFeed.image= req.files.map(f=>({url:f.path,filename:f.filename}))
    newFeed.author=req.user._id;
    user.feeds.push(newFeed);
    await newFeed.save();
    await user.save()
    req.flash('success','Successfully Post is created')
    res.redirect(`/earn/${newFeed._id}`)
}
module.exports.showPost=async (req,res,) => {
    const {id}=req.params;
    const feed = await Feed.findById(id).populate({path:'reviews',populate:{
        path:'author',
    }}).populate('author');
    if(!feed){
        req.flash('error','Cannot find a Post');
        return res.redirect('/earn')
    }
    res.render('show.ejs',{feed})
}
module.exports.editPost=async (req,res) => {
    const {id} = req.params;
    const feed = await Feed.findById(id);
    if(!feed){
        req.flash('error','Cannot find the Post!');
        return res.redirect('/earn')
    }
    res.render('edit.ejs',{feed})
}
module.exports.updatePost=async (req,res) => {
    const {id}=req.params;
    const feed = await Feed.findByIdAndUpdate(id,{...req.body.feeds})
    await feed.save();
    req.flash('success','Successfully post is Post')
    res.redirect(`/earn/${feed._id}`);
}
module.exports.deletePost=async(req,res) => {
    const {id}=req.params;
    await Feed.findByIdAndDelete(id);
    req.flash('success','Successfully deleted post')
    res.redirect('/earn');
}