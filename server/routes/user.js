const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const requireLogin=require('../middleWare/requireLogin')
const Post=mongoose.model("Post");
const User =mongoose.model("User");

router.get('/user/:id',requireLogin,(req,res)=>{
  //  console.log("parmi ",req.params.id)
    User.findOne({_id:req.params.id})
    .select("-password")
    .then((user)=>{ 
          Post.find({postedby:req.params.id})
          .populate("postedby","_id name")
          .exec((err,post)=>{
             // console.log(post);
              if(err)
              {
              return  res.status(422).json({error:err});
              }
              res.json({user,post});
          })
    })
    .catch((err)=>{
        res.status(404).json({error:"User not Found"});
    })
})


router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>{res.json(result)})
        .catch((err)=>res.status(422).json({error:err}))
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{res.json(result)})
        .catch((err)=>res.status(422).json({error:err}))
    })
})


module.exports=router;