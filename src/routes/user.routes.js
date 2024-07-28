import { Router } from "express";
import { registerUser, loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

//adding route and fun that will execute at this route
// router.route('/register').post(registerUser);
router.route("/register").post(
    //before userRegistration do upload using multer
    upload.fields([
        {
            name:'avatar', //keep same name in frontend also
            maxCount:1,
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),
    registerUser);

router.route("/logIn").post(loginUser);

router.route("/logOut").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

export default router