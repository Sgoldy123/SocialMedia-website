const { json } = require('express');
const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
var bcrypt = require('bcryptjs');
const {JWT_TOKEN}=require('../key')
const jwt=require('jsonwebtoken');
const User=mongoose.model('User');
const requireLogin=require('../middleWare/requireLogin');

const nodemailer=require('nodemailer');
const sendgridmailer=require('nodemailer-sendgrid-transport');

const transporter=nodemailer.createTransport(sendgridmailer({
    auth:{
        api_key:"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"
    }
}))


//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


  router.get('/',(req,res)=>{
    //res.send("hello sahil");
    User.find({})
    .then((result)=>{
           
         res.json(result);
    })
    .catch((err)=>{console.log(err)});
})


// router.get('/protected',requireLogin,(req,res)=>{ //requireLogin is a middleware

//     res.send("hello user");
// })


router.post('/signup',(req,res)=>{
  const {name,email,password}=req.body;
  if(!name || !email || !password)
  {
         res.status(404).json({message:"all thing should be filled"});
         return;
  }
  User.findOne({email:email})
  .then((userexist)=>{
      if(userexist)
      {
        return res.status(404).json({message:"email already exist"});
      }
      bcrypt.hash(password,12)
      .then((hashedpassword)=>{

        const user =new User({
            name:name,
            email:email,
            password:hashedpassword
        })
        user.save().then((user)=>{
                transporter.sendMail({
                    to: user.email,
                    from: 'no-reply@insta.com',
                    subject: 'About Registration',
                    html: '<h2>Congrats registered successfully</h2>'
                })
            res.status(200).json({message:"successfully registered"})
        }).catch((err)=>console.log(err ));

      })
      .catch((err)=>console.log("bcrpt ** " + err))  
  })
  .catch((err)=>{
      console.log(err + "----");
  })
})

router.post('/signin',(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password)
    {
        res.status(422).json({error:"add email or passwrd"});
        return;
    }

    User.findOne({email:email})
    .then((result)=>{
        if(!result)
        {
            res.status(422).json({error:"incorrect email or password"});
            return;
        }
        bcrypt.compare(password,result.password)
        .then((check)=>{
            if(check)
            {
              //  res.json({message:"successfuly login"});
                const token=jwt.sign({_id:result._id},JWT_TOKEN);
                const {_id,name,email,followers,following}=result;
                res.json({token:token,user:{_id,name,email,followers,following}}) //token is same as token:token
            }
            else{
                res.status(422).json({error:"incorrect email or password"});
               return;
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    })
    
})





module.exports=router;