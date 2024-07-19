import mongoose from "mongoose";
//db connection is achieved by mongoose only
import {DB_NAME} from '../constants.js';
//require('dotenv').config({path:'./env'})


const connectionDB = async () =>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Mognog DB connection error ${error}`);
        process.exit(1);
    }
}

export default connectionDB