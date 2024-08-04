import mongoose,{Schema} from "mongoose";

const subscriptionSchema=new Schema({

    //one who is subscribing
    subscriber:
    {
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    //whose channel has been subscribing
    channel:
    {
        type:Schema.Types.ObjectId,
        ref:"User"
    },


},{timestamps:true})

export const subscriptionModel = mongoose.model("SubModel",subscriptionSchema);