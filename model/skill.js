const mongoose=require('mongoose');
const {Schema} = mongoose

const skillSchema = new Schema({
    body:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
})
module.exports= mongoose.model('Skill',skillSchema)