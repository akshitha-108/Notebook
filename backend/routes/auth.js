const express = require('express')
const router = express.Router() 
const User = require('../models/User')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "Harryisagoodb$oy"

// ROUTE 1:create a user using: POST "/api/auth/" doesn't require auth
router.post('/createuser',[
    body('name','enter a valid name').isLength({min:3}),
    body('email','enter a valid email').isEmail(),
    body('password','password must be atleast 8 characters').isLength({min:5}),
    ],async (req,res)=>{
    //if there are errors, return Bad request and the error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    //check whether the email exists already
    try{
    let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({error:"Sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt)
    //create a new user
    user = await User.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email,
    })
    const data={
        user:{
            id:user.id
        }
    }
        const authtoken = jwt.sign(data, JWT_SECRET)
        

        // res.json({user}) 
        res.json({authtoken})
    }
    //catch error
    catch(error){
    console.log(error.message)
    res.status(500).send("Some error occured")
}
})


//ROUTE 2:Authneticating a user using POST:"/api/auth/login"
router.post('/login',[
    body('email','enter a valid email').isEmail(),
    body('password','password cannot be blank').exists(),
    ],async (req,res)=>{
    
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const {email,password} = req.body;
        try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"please login through correct credentials"})

        }
        const passwordCompare = await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({error:"please login through correct credentials"})
        
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({authtoken})
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
    })


//Route 3: Get loggedin user details using: POST "/api/auth/getuser" Login required
router.post('/getuser',fetchuser,async (req,res)=>{
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
    
}catch(error){
    console.log(error.message)
    res.status(500).send("Internal Server Error")
}
    })
module.exports=router