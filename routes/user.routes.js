const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel=require('../models/user.model')
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

// route will be (/user/route)
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register",
  body("email").trim().isEmail().isLength({min:1}),
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  async(req, res) => {
    const error=validationResult(req);

    if(!error.isEmpty()){
      return res.status(400).json({
        error:error.array(),
        message:'Invalid data'
      })
    }
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);  //10 denotes no. of hashing rounds
    const newUser=await userModel.create({
        email,
        password:hashedPassword,
        username
    });
    res.json({newUser})
  }
);

router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login',body('username').trim().isLength({min:3}),
body('password').trim().isLength({min:5}),
async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            error:error.array(),
            message:'Invalid data'
            })
    }
    const {username,password}=req.body;
    const user =await userModel.findOne({  //this also stopres password
        username:username
    })
    if(!user){
        return res.status(400).json({
            message:'Invalid username or password'
        })
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({
            message:'Invalid username or password'
        })
    }
    const token=jwt.sign({
        userId:user._id,
        username:user.username,
        email:user.email
    },
    process.env.JWT_SECRET,
    )
    // res.json({token})
    res.cookie('token',token)  //1st is cookie-name,2nd is actual value(token here)
    res.send('Logged in')

})
module.exports = router;
