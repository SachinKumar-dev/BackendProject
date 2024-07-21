import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router()

//adding route and fun that will execute at this route
// router.route('/register').post(registerUser);
router.route("/register").post(registerUser);
export default router