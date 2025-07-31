import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"
const app =express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:true,limit:"20kb"}));
app.use(express.static("public"))
app.use(cookieParser())
import userRoutes from "./routes/user.routers.js";
import productRoutes from "./routes/product.routers.js";
import cartRoutes from "./routes/cart.routers.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js"

app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use(globalErrorHandler);

export {app} 