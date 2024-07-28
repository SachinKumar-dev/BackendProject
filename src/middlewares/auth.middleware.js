import { User } from "../models/user.model.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

//whether user exists or not -> logged valid user-> valid tokens
const verifyJWT=asyncHandler(async(req,res,next)=>{
   try {
     //validating access tokens from req and cookies(server)
     const token=req.cookies?.accessToken || req.header("Authorization") ?.replace("Bearer ",""); 


     if(!token){
         throw new ApiErrorHandler(401,'Unauthorized request!')
     }
 
     //if token exists
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!user){
         throw new ApiErrorHandler(401,"Invalid Access Token");
     }
 
     //if user exists , add whole user object to req body so we can acees now req.user also
     req.user=user;
     next()
   } catch (error) {
        throw new ApiErrorHandler(401,error?.message ||"Invalid User!")
   }

})


export {verifyJWT}