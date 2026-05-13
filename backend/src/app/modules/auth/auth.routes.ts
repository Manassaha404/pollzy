import { Router } from "express";
import authController from "./auth.controller.js";
import { validate } from "../../common/middlewares/validate.js";
import { userRegisterDto, userLoginDto, forgotPassDto, resetPassDto, resetTokenDto } from "./auth.validation.js";
import { authorization, isGuestTokenExisted } from "./auth.middleware.js";
const authRouter:Router = Router()

authRouter.post("/register", validate(userRegisterDto), authController.userRegister)
authRouter.post("/login", validate(userLoginDto), authController.userLogin)
authRouter.get("/info", authorization, authController.getUserInfo)
authRouter.post("/forgot-password", validate(forgotPassDto), authController.forgotPass)
authRouter.post("/reset-password/:token", validate(resetPassDto), authController.resetPass)
authRouter.post("/reset-token", authController.resetTokens)
authRouter.post("/logout", authorization, authController.logout);
authRouter.post("/guestToken", isGuestTokenExisted, authController.guestToken)
export default authRouter;