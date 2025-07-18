import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.meddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, getAllProducts } from "../controllers/product.controller.js";

const router = Router();

router.route("/").post(verifyJWT,upload.fields([{ name: "image", maxCount: 1 }]), createProduct);
router.route("/").get(verifyJWT,getAllProducts);

export default router;