import express from "express";
import userRouter from "./routers/userRouter.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";


const app = express();
app.use(express.json())

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization")
        if (value != null){
        const token = value.replace("Bearer ","")
        jwt.verify(token,
            "cbc-6503",
            (err,decoded)=>{
                if (decoded == null){
                    res.status(403).json({
                            message : "Unauthorized",
                    })
                }else{
                    req.user = decoded
                //    console.log(decoded)
                    next()
                }
        }) 
        }else{
            next()
        }
    }
)


app.listen(5000,()=>{
    console.log ("server is running");
})

app.use("/api/users",userRouter)
app.use("/api/products",productRouter)

let connectionString = "mongodb+srv://admin:123@cluster0.bskafgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(connectionString).then(
    ()=>{
        console.log("DB connected")
    }
).catch(
    ()=>{
        console.log("Failed to connect")
        
    }
)