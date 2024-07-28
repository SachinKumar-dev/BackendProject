import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({

 userName:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
 },

 email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
 },

 fullName:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
 },

 avatar:{
    type:String, //cloudinary url
    required:false,
    unique:true,
    lowercase:true,
    trim:true,
 },

 coverImage:{
    type:String,
    required:false  //cloudinary url
 },

 watchHistory:[
    {
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
 ],

 password:{
    type:String,
    required:[true,'Password is required'],
 },

 refreshToken:{
    type:String
 },

},{
    timestamps:true
})

//pre hooks , uses async for computations and next flag takes and passes to next for usage
userSchema.pre("save",async function(next){
    //ensure not to encrypt the pass everytime on save of existing user details
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        next();
    }
    else{
        return next();
    }
   
})


//custom mongoose function for password validation
userSchema.methods.isPasswordValid=async function(password){
    return await bcrypt.compare(password,this.password);
}

//JWT
//Access Token Generation
userSchema.methods.generateAccessToken=function(){
   return jwt.sign({
        //payload --> data
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName,
    },
    //buffer
    process.env.ACCESS_TOKEN_SECRET,
    //object
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

)
}

//Refresh Token Generation
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        //payload --> data
        _id:this._id,
    },
    //buffer
    process.env.REFRESH_TOKEN_SECRET,
    //object
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User =  mongoose.model('User',userSchema);