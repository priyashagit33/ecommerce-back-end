
import axios from "axios";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import OTP from "../models/otp.js";
const pw = "vsxyqmbqgoichdaa"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: "edirisinghekasun33@gmail.com",
        pass: pw,
    },

})


export function createUser(req,res){
    
if (req.user == null){
    res.status(403).json({
        message: "Please login to create a student"
    }  
    );
    return
}
if (req.user.role != "admin"){
    res.status(403).json({
        message: "Please login as an admin to create users"
    });
    return
}

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

export function loginUser(req,res){  // user Authentication
    const email = req.body.email
    const password = req.body.password
    console.log(password)

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
                console.log(user)
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
                message : " Login Successful ",
                role : user.role
            })
            }else{
                res.json({
                    message : "Password is incorrect"
                })
            }
        }
})
}

export function getUser(req,res) {
    if (req.user == null){
        res.status(404).json({
            message: "User not found"
        })
    }else{
        res.json(req.user)
    }
}

export function isAdmin(req){
    // console.log (req.user.role)
    if (req.user == null){
        return false;
    }
    if (req.user.role == "admin"){
        return true;
    }else {
        return false;
    }
}

export async function googleLogin(req,res){
    const googleToken = req.body.token;

     console.log(req.body.token)

    try{
        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",{
                headers:{
                    Authorization:`Bearer ${googleToken}`
                }
            }
        );

        const user = await User.findOne({
            email: response.data.email,
        });
        if (user != null){

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
                message : " Login Successful ",
                role : user.role
            })

        }else{
            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                image: response.data.picture,
                role:"user",
                inBlocked: false,
                isEmailVerified: true,
                password: "123"

            })
            await newUser.save();

            const token = jwt.sign({
                    email : newUser.email,
                    firstName : newUser.firstName,
                    lastName : newUser.lastName,
                    role : newUser.role,
                    isBlocked : newUser.isBlocked,
                    isEmailVerified : newUser.isEmailVerified,
                    image : newUser.image
                },"cbc-6503"
            )
            res.json({
                token : token,
                message : " Login Successful ",
                role : newUser.role
            })

        }

    } catch(error){
        console.error("Error fetching Google use infor:",error)
        res.status(500).json({
            message: "Failed to authenticate with Google"
        })
    }
    
}

export async function sendOTP(req,res){
    const email = req.body.email;
    const otpCode = Math.floor(100000 + Math.random() * 900000)

    OTP.deleteMany({email:email}).then(()=>{
        const newOTP = new OTP({
            email:email,
            otp:otpCode,
        });
        newOTP.save()
    })

    const message = {
        from : "edirisinghekasun33@gmail.com",
        to: email,
        subject: "Your OTP code",
        text: `Your OTP code is ${otpCode}`,
    }

    transporter.sendMail(message, (error,info)=>{
        if (error) {
            console.error("Error sending email", error);
            res.status(500).json({message: "Failed to send the OTP"});
        }
        else{
            console.log("Email sent", info.response);
            res.json({message:"OTP sent successfully"})
        }
        }
    )
}

export async function resetPassword(req,res) {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const otp = req.body.otp;
    console.log(newPassword)
    try{
        const otpRecord = await OTP.findOne({email:email, otp:otp});
        if(!otpRecord){
            return res.status(404).json({message: "Invalid OTP"})
        }

        const user = await User.findOne({email:email});
        if (!user){
            return res.status(404).json({message: "User not found"})
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)
        await user.updateOne({password:hashedPassword});
        await OTP.deleteMany({email:email})
        res.json({message: "Password was reset successfully"})
    

    }catch(error){
        console.log(error)
        res.status(500).json({message: " Failed to reset password "})
    }
    
    
}



