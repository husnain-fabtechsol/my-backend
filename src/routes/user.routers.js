import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    getAllUsers,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.meddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import  authorizeRoles  from "../middlewares/authorizeRoles.js";



const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverimage", maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/").get(verifyJWT, getCurrentUser);
router.route("/").patch(verifyJWT, updateUserProfile);
router.route("/all").get(verifyJWT,authorizeRoles("AD"), getAllUsers);


export default router;