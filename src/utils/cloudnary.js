import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
export const uploadOnCloudinary = async (filePath) => {
 
    try {
            const response= await cloudinary.uploader.upload(filePath, {
                
                resource_type: "auto",
            });
            if(filePath){

                fs.unlinkSync(filePath);
            }
    return response

    } catch (error) {
     if(filePath){

                fs.unlinkSync(filePath);
            }
        // Log the error for debugging purposes
        console.error("Error uploading image to Cloudinary:", error);
        return null
        
    }
}
