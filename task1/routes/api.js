//this is your router file where you can create the  api  basically CRUD(creat,read,update,delete)
const express = require('express');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
userrouter = express.Router();
const FormModel = require('../models/Form');

// signup or post route
userrouter.post("/submit-form",async(req,res)=>{
    // console.log(req.body); 
    const {firstName,lastName , mobileNo,email, loginId, address, password}=req.body
        if(!email||!password||!firstName||!lastName||!loginId||!address||!mobileNo){
            return res.status(401).json({err:"msg all field require"})
        }else{
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ error: "Invalid email address." });
            }
    
            if (!/^[a-zA-Z0-9]+$/.test(loginId)) {
                return res.status(400).json({ error: "Login ID must be alphanumeric." });
            }
            // Password validation (6 characters, 1 upper case letter, 1 lower case letter, 1 special character)
            if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
                return res.status(400).json({ error: "Password must be 8 characters." });
            }
            try {
                const user = await FormModel.findOne({email:email})
                if(user){
                    return res.status(409).json({msg:"email already present !!"})
                }else{
                   bcrypt.hash(password,10,async(err,hash)=>{
                    if(hash){
                        let newdata =new FormModel({
                            email,email,
                            password:hash,
                            firstName:firstName,
                            lastName:lastName,
                            address:address,
                            mobileNo:mobileNo,
                            loginId:loginId
                        })
                        await newdata.save();
                        return res.status(201).send({msg:"signup sucessfully !!!",newdata})
                    }else{
                        throw err
                    }
                   })

                }
                
            } catch (error) {
                res.status(500).json({err:"error not able to signup"})
            }
        }
})

userrouter.post("/login", async (req, res) => {
    const { loginId, password } = req.body;
  try {
        // Check if the user exists in the database
        const user = await FormModel.findOne({ loginId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } 
         // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }
 // Generate a JWT token
        const tokenPayload = {
            userId: user._id,
            loginId: user.loginId, // Include the loginId in the payload
            name: user.firstName,
            email: user.email
        };

        const token = jwt.sign(tokenPayload, 'your-secret-key', { expiresIn: '1h' });
       
        // const token = jwt.sign({ userId: user._id,name:user.firstName,email:user.email   }, 'deepika', { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id,name:user.firstName,email:user.email   } );
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

userrouter.post("/user-data", async (req, res) => {
    const { loginId } = req.body;
    try {
        // Fetch user information from the database
        const userData = await FormModel.findOne({ loginId });

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports= userrouter
