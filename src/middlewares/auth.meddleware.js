import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import usermodel from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token, "token");

    if (!token) {
        return next(new ApiError(401, "Unauthorized request"));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);


        const user = await usermodel.findById(decodedToken.id).select("-password");

        if (!user) {
            return next(new ApiError(401, "Invalid access token"));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ApiError(401, "Token has expired"));
        } else if (error.name === "JsonWebTokenError") {
            return next(new ApiError(401, "Invalid token"));
        } else {
            return next(new ApiError(401, "Unauthorized request"));
        }
    }
});

export { verifyJWT };