const { string } = require('joi');
const mongoose=require('mongoose');
const {Schema}=mongoose
const passportLocalMongoose=require('passport-local-mongoose');
const ImageSchema =  new Schema({
    url:String,
    filename:String,
})
const opts = { toJSON: { virtuals: true } };
const userSchema=new Schema({
    feeds:[
        {
            type:Schema.Types.ObjectId,
            ref:"Feed"
        }
    ],
    given:[{
        type: Schema.Types.ObjectId,
        ref:'Task'
    }],
    skill:[
        {
        type: Schema.Types.ObjectId,
        ref:'Skill'
        },
      ],  
      task:[
        {
        type: Schema.Types.ObjectId,
        ref:'Task'
        },
      ],  
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
email:{
        type:String,
        required:true,
        unique:true,
    }, 
    location:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    year:{
        type:Number,
        required:true,
    },
    qualification:{
        type:String,
        enum:['none','SSLC','HSC','UG','PG'],
        required:true,
    },
    
    image:[ImageSchema],
    aadharNo:{
        type:Number,
        unique:true,
    },
    address:{
        type:String,
        required:true,
    }
},opts);
userSchema.plugin(passportLocalMongoose)
userSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/account/${this._id}">${this.username}</a><strong>`
});
module.exports=mongoose.model('User',userSchema);
