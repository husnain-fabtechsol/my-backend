import usermodel from "../models/user.model.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const users = await usermodel.find();
    res.send(users);
});

export default router;