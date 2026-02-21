import Product from "../models/product.js"
import { isAdmin } from "./userController.js"

export async function createProduct(req, res) {

    if (!isAdmin(req)) {
        return res.status(403).json({
            message: " You are not authorized to create products "
        })
    }

    const product = new Product(req.body);

    try {
        const response = await product.save();
        res.json({
            message: " Product is created successfully ",
            product: response
        }
        )
    } catch (error) {
        console.error("Error creating the product:", error);
        return res.status(500).json({ message: "Failed to create the product " })
    }
}

export async function getProduct(req, res) {
    console.log("Fetching products")
    console.log(isAdmin(req))
    try {

        if (isAdmin(req)) {
            const products = await Product.find();
            return res.json(products)
        }
        else {
            const products = await Product.find({ isAvailable: true });
            return res.json(products)
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Failed to fetch products" })
    }
}


export async function deleteProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({ message: "Access Denied" });
        return;
    }

    try {
        const productId = req.params.productId;

        await Product.deleteOne({
            productId: productId
        })
        res.json({ message: " Product Deleted Successfully" })

    } catch (error) {
        console.error(" Error Deleting product:", error);
        res.status(500).json({ message: " Failed to Delete the product" })
        return;
    }

}


export async function updateProduct(req, res) {

    if (!isAdmin) {
        res.status(403).json({ message: " Access Denied " });
        return;
    }

    const data = req.body;
    const productId = req.params.productId;
    data.productId = productId;

    try {
        await Product.updateOne(
            {
                productId: productId,
            },
            data
        );
        console.log(data)
        res.json({ message: " Product is updated successfully" })

    } catch (error) {
        console.error("Error updating the product", error);
        res.status(500).json({ message: " Failed to update" });

    }

}

export async function getProductInfo(req, res) {

    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: productId })

        if (product == null) {
            res.status(404).json({ message: "Product not found" })
            return;
        }

        if (isAdmin(req)) {
            res.json(product);
        } else {
            if (product.isAvailable) {
                res.json(product);
            } else {
                res.status(404).json({ message: " Product is not available" })
            }
        }

    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Failed to fetch products" })
    }


}