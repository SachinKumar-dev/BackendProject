import dotenv from "dotenv";
import connectionDB from "./db/index.js"; //calling db connection fun
import express from "express";

const app=express()

dotenv.config({
    path: './env'
})

connectionDB().then(()=>{
    //console.log(response);
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on port num ${process.env.PORT}`);
    })
}).catch((error)=>{
    console.log(`DB error is ${error}`);
})




//IIFE
//Db Connection
/*(async()=>{

    try {
        //specify url in connect and DB Name
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //error handling by express
        app.error("error",(error)=>{
            console.log(`Error ${error}`);
            throw error;
        })
        //listen on port
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.log(`Error ${error}`);
        throw error;
    }
})() */