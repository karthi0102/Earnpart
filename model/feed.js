const mongoose = require('mongoose');
const {Schema}=mongoose
const Review = require('./review');
const ImageSchema =  new Schema({
    url:String,
    filename:String,
})
const feedSchema = new Schema({
    image:[ImageSchema],
    domain:{
        type:String,
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },coordinates:{
            type:[Number],
            required:true,
        }
    },
    location:{
        type:String,
    },
    desc:{
        type:String,
    },
    duration:{
        type:Number,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
        type: Schema.Types.ObjectId,
        ref:'Review'
    }
],
})
feedSchema.post('findOneAndDelete', async (data)=>{
    if(data){
        await Review.deleteMany({
            _id :{
                $in:data.reviews

            }
        })
    }
})
const Feed = mongoose.model('Feed', feedSchema);

module.exports=Feed;