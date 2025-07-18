import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import usermodel from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
// console.log(token,"token")
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken,"decodedToken")

    const user = await usermodel.findById(decodedToken.id).select("-password");

    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
});

export { verifyJWT };