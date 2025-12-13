import express from "express";
import { createProduct, deleteProduct, getProduct, getProductInfo, updateProduct } from "../contollers/productController.js";

const productRouter = express.Router()

productRouter.post("/",createProduct)
productRouter.get("/",getProduct)
productRouter.get("/:productId", getProductInfo)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)

export default productRouter