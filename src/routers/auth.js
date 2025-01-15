import { Router } from "express";

import { validateBody } from "../utils/validateBody.js";

import * as authController from "../controllers/auth.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authRegisterSchema, authLoginSchema, authRequestResetEmailSchema, authResetPasswordSchema } from "../validation/auth.js";


const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrlWrapper(authController.registerController));

authRouter.post(
  "/send-reset-email",
  validateBody(authRequestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(authResetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);

authRouter.post("/login", validateBody(authLoginSchema), ctrlWrapper(authController.loginController));

authRouter.post("/refresh", ctrlWrapper(authController.refreshTokenController));

authRouter.post("/logout", ctrlWrapper(authController.logoutController));




export default authRouter;
