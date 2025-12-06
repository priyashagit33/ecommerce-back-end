
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";



export function createUser(req,res){
    
    const passwordhash = bcrypt.hashSync(req.body.password,10)

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordhash
    }

    const user = new User(userData)



    user.save().then(
        ()=>{

            res.json(
                {
                    message:" User Created "
                }
            )
        }
    )
    .catch(
        (err)=>{
            res.json(
                {
                    message:"failed"
                }
            )
            console.log(err)
        }
    )
}

export function loginUser(req,res){
    const email = req.body.email
    const password = req.body.password

    User.findOne(
        {
            email:email
        }
    ).then(
        (user)=>{
            if (user==null){
                res.status(404).json({
                    message: "user not found"
                })
            }else{
                const isPasswordCorrect = bcrypt.compareSync(password,user.password);
                if (isPasswordCorrect) {
                const token = jwt.sign({
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    isBlocked : user.isBlocked,
                    isEmailVerified : user.isEmailVerified,
                    image : user.image
                },"cbc-6503"
            )
            res.json({
                token : token,
                message : " Login Successful "
            })
            }else{
                res.json({
                    message : "Password is incorrect"
                })
            }
        }
})
}

