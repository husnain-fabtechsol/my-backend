import {Router} from "express";

import { getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../controllers/cart.controller.js";

import { verifyJWT } from "../middlewares/auth.meddleware.js";
const router = Router();


router.route("/").get(verifyJWT,getCart);
router.route("/").post(verifyJWT, addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;
