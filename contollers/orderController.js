import Order from "../models/order.js";
import Product from "../models/product.js"

export async function createOrder(req,res){
   try{ 
    if (req.user == null){
        res.status(404).json({message:"Please login to create orders"})
        return;
    }
    //CBC00202
    const latestOrder = await Order.find().sort({date : -1}).limit(1)
    
    let orderId = "CBC00001"

    if (latestOrder.length > 0 ){   // if old order exists

        const lastOrderIdInString = latestOrder[0].orderID;
        const lastOrderIdWithoutPrefix = lastOrderIdInString.replace("CBC","")
        const lastOrderIdInInteger = parseInt(lastOrderIdWithoutPrefix)
        const newOrderIdInInteger = lastOrderIdInInteger + 1
        const newOrderIdWithoutPrefix = newOrderIdInInteger.toString().padStart(5,'0')
        orderId = "CBC"+newOrderIdWithoutPrefix
        

    }
    const items = [];
    let total = 0;

    if (req.body.items !== null && Array.isArray(req.body.items)) {

        for(let i=0; i<req.body.items.length; i++){

            let item = req.body.items[i]

            let product = await Product.findOne({
                productId:item.productId
            });

            if (product == null){
                res.status(400).json({message: " Invalid product ID"})
                return;
            }
            items[i] = {
                productId: product.productId,
                name: product.name,
                image: product.images[0],
                price: product.price,
                qty: item.qty
            }
           total += product.price * item.qty
        }

    }else{
        res.status(400).json({message : " Invalid Items format"})
        return;

    }
    
    const order = new Order({
        orderID : orderId,
        email:req.user.email,
        name:req.user.firstName + " " + req.user.lastName,
        address: req.body.address,
        phone:req.body.phone,
        items:items,
        total: total
    })

    const result = await order.save();

    res.json({
        message: "Order is created",
        result:result
    })
   

}catch (error) {
    console.error("Error creating the product:", error)
    res.status(500).json({message:" Failed to create the product"})
}
} 

export async function getOrders(req,res){

    if (req.user == null){
        res.status(401).json({message: " Please login first to see orders "})
        return;
    }
    try{
        if(req.user.role == "admin"){
            const orders = await Order.find().sort({date:-1});
            res.json(orders)
        }else{ 
            const orders = await Order.find({email: req.user.email})
            res.json(orders)
        }

    }catch(error){
        console.error("Error fetching orders", error)
        res.status(500).json({message: " Failed to fetch the orders"})

    }

}



