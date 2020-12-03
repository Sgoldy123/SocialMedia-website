const {JWT_TOKEN}=require('../key')
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const User = mongoose.model("User");

module.exports=(req,res,next)=>{

    //authorization=== "Bearer sdddsewfewfwefwefefwe"   =======eg::

    const {authorization}=req.headers;
    if(!authorization)
    {
        return res.json({error:"you must be logged in"});
    }

    
    const token=authorization.replace("Bearer ","");

    jwt.verify(token,JWT_TOKEN,(err,payload)=>{
        if(err)
        {
            return res.json({error:"you must be logged in"});

        }
   //     console.log("$$$$ "+payload);
        const {_id}=payload;
        User.findById(_id)
        .then((userData)=>{
            req.user=userData;
            next();
        })
       
        

    })



}