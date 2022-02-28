const {cloudinary} = require('../cloudinary')
const { isValid, isValidVID } = require("@make-sense/adhaar-validator");
const User=require('../model/user')
const mbxGecoding= require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGecoding({accessToken:mapBoxToken})
module.exports.renderRegister=(req,res)=>{
    res.render('register.ejs');
}

module.exports.register=async(req,res)=>{
    try{
        const geoData= await geocoder.forwardGeocode({
            query:req.body.location,
            limit:1,
        }).send()
    const {email,username,password,year,phone,qualification,location,aadharNo,address,Cpassword}=req.body;
    if(Cpassword!=password){
        req.flash('error',"Confirm your password");
        return res.redirect('/register')
    }
    if(!isValid(aadharNo)){
        req.flash('error','Aadhar card number is not valid')
        return res.redirect('/register')
    }
    const user = new User({username,email,year,phone,qualification,location,aadharNo,address})
    user.geometry=geoData.body.features[0].geometry
    user.image= req.files.map(f=>({url:f.path,filename:f.filename}))
    const newUser=await User.register(user,password);
    req.login(newUser,err =>{
        if(err) return next(err);
        req.flash('success','Welcome to EARN&LEARN');
         res.redirect('/earn');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}
module.exports.renderLogin=(req,res)=>{
    res.render('login.ejs');
}
module.exports.login=(async(req,res)=>{
    const id =req.user._id;
    const user = await User.findById(id);
    req.flash('success',`Welcome ${user.username}`);
    const redirectUrl= req.session.returnTo || '/earn'
    delete req.session.returnTo
    res.redirect(redirectUrl);
})
module.exports.logout=(req,res)=>{
    req.logOut();
    req.flash('success',"GOODBYE ");
    res.redirect('/earn');
}