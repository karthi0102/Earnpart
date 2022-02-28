const mongoose=require('mongoose');
const {Schema}=mongoose
const ImageSchema =  new Schema({
    url:String,
    filename:String,
})
const taskSchema=new Schema({
    image:[ImageSchema],
    title:String,
    desc:String,
    stipend:Number,
    days:String,
    guide:{
        type:String,
    },
    applier:[
        {
        type:Schema.Types.ObjectId,
        ref:'User'
    }
],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    progress:Number,
});
module.exports=mongoose.model('Task',taskSchema);
