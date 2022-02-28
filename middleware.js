const {feedSchema,reviewSchema} = require('./schema.js')
const Feed = require('./model/feed')
const Review=require('./model/review');
const ExpressError=require('./utils/ExpressError')
module.exports.isLoggedIn = async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error','You must Login first');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground=(req,res,next) => {
    const {error}= feedSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params
    const camp = await Feed.findById(id)
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that')
       return res.redirect(`/earn/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}=req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that')
        return res.redirect(`/earn/${id}`)
    }
    next();
}
module.exports.validateReview=(req,res,next) => {
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}