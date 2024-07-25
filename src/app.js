import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

//use for middleware
//cors ensure only valid request will be process from valid client not from everyone
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//limit json to accept
app.use(express.json({limit:"16kb"}));

//url parse
app.use(express.urlencoded({extended:true,limit:"16kb"}));

//if want to store anything or file on server then the folder name in root
app.use(express.static("public"));

//crud on cookies
app.use(cookieParser());


//routes
import userRouter from './routes/user.routes.js'

//routes.declaration
//cant use app.get directly as routes are coming from different file, use app.use(middleware)
//api versioning
app.use("/api/v1/users",userRouter);

// http://localhost:8000/api/v1/users/register
//http://localhost:8000/api/v1/users/login


export {app}