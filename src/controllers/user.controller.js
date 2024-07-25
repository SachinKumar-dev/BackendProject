import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponseHandler } from "../utils/ApiResponseHandler.js";

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

    //local path of uploaded files within node server
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

        //remove password and refresh token from db
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiErrorHandler(500, "Something went wrong while registering the user");
        }

        return res.status(201).json(
            new ApiResponseHandler(200, createdUser, "User registered successfully")
        );  
});

export { registerUser };
