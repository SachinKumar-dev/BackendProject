import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponseHandler } from "../utils/ApiResponseHandler.js";
import jwt from "jsonwebtoken";
//methods
const generateAccessAndRefreshToken=async(userId)=>{
    try {
            //in order to generate we need to access methods so create the instance for User model ref.
            const user=await User.findOne(userId);
            //now access user.access/refresh methods
           const accessToken= user.generateAccessToken()
           const refreshToken= user.generateRefreshToken()
            //give user the token access
            user.refreshToken=refreshToken;
            //save this to db and remove other validn
            await user.save({validateBeforeSave:false});

            return {accessToken,refreshToken};

    } catch (error) {
        console.log(`error is ${error}`);
        throw new ApiErrorHandler(500,'Something went wrong, unable to generate the access and refresh tokens')
    }
}

//user registration
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, userName, password } = req.body;
    console.log("email:", email);
    console.log("fullName:", fullName);
    console.log("userName:", userName);
    console.log("password:", password);

    if ([fullName, email, userName, password].some(field => field?.trim() === "")) {
        throw new ApiErrorHandler(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiErrorHandler(409, "User with email or username already exists");
    }

    console.log(req.files);

    //local path of uploaded files within node server -> multer 
    const avatarLocalPath = req.files?.avatar ? req.files.avatar[0].path : null;
    const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0].path : null;

    console.log(`avatarLocalPath: ${avatarLocalPath}`);
    console.log(`coverImageLocalPath: ${coverImageLocalPath}`);

    //files uploaded to cloudinary will give response back
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

        if (!avatar || !avatar.url) {
            throw new ApiErrorHandler(400, "Failed to upload avatar to Cloudinary");
        }

        //create user on db and add response.url-> avatar.url
        const user = await User.create({
            fullName,
            coverImage: coverImage?.url || "",
            email,
            avatar:avatar.url,
            password,
            userName: userName.toLowerCase()
            
        });

        //remove password and refresh token from respone so that it shouldn't be visible to user 
        //as this createdUser has the response in it same as stored to db (document)
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        //console.log(`create User details is ${createdUser}`);

        if (!createdUser) {
            throw new ApiErrorHandler(500, "Something went wrong while registering the user");
        }

        return res.status(201).json(
            new ApiResponseHandler(200, createdUser, "User registered successfully")
        );  
});

//user login
const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    const {email,password,userName}=req.body
    console.log(`email:${email}`);
    console.log(`password:${password}`);
    console.log(`userName:${userName}`);

    if (!userName && !email) {
        throw new ApiErrorHandler(400, "username and email required!")
    }
    
    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if (!user) {
        throw new ApiErrorHandler(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordValid(password)

   if (!isPasswordValid) {
    throw new ApiErrorHandler(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponseHandler(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

//user logout
const logoutUser=asyncHandler(async(req,res)=>{
    //remove refresh token from db if user found with _id in db
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {   
            //get new res without refreshToken 
            new :true
        }

    )

    
 const options={
    httpOnly:true,
    secure:true
 }

 //clearCookie removes tokens from user/client too
 return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
    new ApiResponseHandler(200,{},"User logged out successfully!")
 );


})


//generate access token if expires
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiErrorHandler(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiErrorHandler(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiErrorHandler(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponseHandler(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiErrorHandler(401, error?.message || "Invalid refresh token")
    }

})



export { registerUser,loginUser,logoutUser,refreshAccessToken };
