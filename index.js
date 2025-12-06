import express from "express";
import userRouter from "./routers/userRouter.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json())

app.listen(5000,()=>{
    console.log ("server is running");
})

app.use("/users",userRouter)

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