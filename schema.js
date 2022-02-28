const Joi=require('joi');
module.exports.feedSchema= Joi.object({
    feeds:Joi.object({
        duration:Joi.number().required().min(0),
        desc:Joi.string().required(),
        location:Joi.string().required(),
        domain:Joi.string().required(),
    }).required()  
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5),
    }).required()
})
