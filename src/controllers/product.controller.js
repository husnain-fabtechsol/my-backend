
 import { productModel } from "../models/product.model.js";
 import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudnary.js";
 const createProduct = asyncHandler(async (req, res) => {
     const { title, description, price } = req.body;
 
     if (!title || !description || !price ) {
         throw new ApiError(400, "All fields are required");
     }
 
     const image = req.files?.image?.[0]?.path || null;
     const imageAfterUpload = await uploadOnCloudinary(image);

   
 
     if (!imageAfterUpload) {
         throw new ApiError(400, "Image is required");
     }
 
     const product = await productModel.create({
         title,
         description,
         price,
        image: imageAfterUpload.url
     });
 
     return res
         .status(201)
         .json(new ApiResponse(201, "Product created successfully", product));
 })
 const getAllProducts = asyncHandler(async (req, res) => {
     const products = await productModel.find();
 
     return res
         .status(200)
         .json(new ApiResponse(200, "Products fetched successfully", products));
 })
 
 export { createProduct,getAllProducts }