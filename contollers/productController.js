import Product from "../models/product.js"
import { isAdmin } from "./userController.js"

export async function createProduct (req,res) {

        if (!isAdmin(req)) { 
        return res.status(403).json ({
            message : " You are not authorized to create products "
        })
    }

    const product = new Product(req.body);

    try {
        const response = await product.save();
        res.json ( {
            message : " Product is created successfully ",
            product : response
        }
        )
    } catch (error){
        console.error("Error creating the product:", error);
        return res.status(500).json({ message : "Failed to create the product "})
    }
}

export async function getProduct(req,res) {
    console.log(isAdmin(req))
try{
    
    if (isAdmin(req)){
        const products = await Product.find();
        return res.json(products)
    }
    else{
        const products = await Product.find({isAvailable: true});
        return res.json(products)
    }
}catch(error){ 
    console.error("Error fetching product:",error);
    return res.status(500).json({message:"Failed to fetch products"})
}  
}

export async function deleteProduct(req,res){
    
}