import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import validateModel from "../middlewares/validate.middleware.js";
import User from "../models/user.model.js";


const userRouter = Router()

userRouter.route("/register").post(validateModel(User) ,registerUser)
userRouter.route("/login").post(loginUser)

export default userRouter