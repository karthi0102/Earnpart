const Feed=require('../model/feed');
const Review = require('../model/review');

module.exports.newReview=async(req,res)=> {
    const feed =  await Feed.findById(req.params.id);
    const review =  new Review(req.body.review);
    feed.reviews.push(review);
    review.author=req.user._id;
    await review.save();
    await feed.save();
    req.flash('success','Your review is posted')
    res.redirect(`/earn/${feed._id}`);
}
module.exports.deleteReview=async (req,res) =>{
    const {id,reviewId} = req.params;
    await Feed.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review')
    res.redirect(`/earn/${id}`);
}