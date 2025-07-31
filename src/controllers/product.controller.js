
 import { productModel } from "../models/product.model.js";
 import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { paginate } from "../utils/pagination.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudnary.js";
 const createProduct = asyncHandler(async (req, res,next) => {
     const { title, description, price ,stock} = req.body;
 
     if (!title || !description || !price  || !stock) {
        next(new ApiError(400, "All fields are required"))
     }
 
     const image = req.files?.image?.[0]?.path || null;
     const imageAfterUpload = await uploadOnCloudinary(image);

   
 
     if (!imageAfterUpload) {
         next(new ApiError(400, "Image is required"));
     }
 
     const product = await productModel.create({
         title,
         description,
         price,
        image: imageAfterUpload.url,
        stock
     });
 
     return res
         .status(201)
         .json(new ApiResponse(201, "Product created successfully", product));
 })
const getAllProducts = asyncHandler(async (req, res) => {
    const results = await paginate(productModel, req);
    
    return res
        .status(200)
        .json(
            results
        );
});
 export { createProduct,getAllProducts }