import mongoose, {Schema,Model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema({

    videoFile:{
        type:String,
        required:[ true,'Video File Missing!']
    },

    thumbNail:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    duration:{
        type:Number,
        required:true
    },

    views:{
        type:Number,
        default:0
    },

    thumbNail:{
        type:String,
        required:true
    },

    isPublished:{
        type:Boolean,
        default:true
    },

    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },


},
{
    timestamps:true
}

)
//imp to add 
videoSchema.plugin(mongooseAggregatePaginate);

const videoModel = new Model('Video',videoSchema);