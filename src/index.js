import dotenv from "dotenv";
import connectionDB from "./db/index.js"; //calling db connection fun
import { app } from "./app.js";

dotenv.config({
    path: './env'
})


connectionDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
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