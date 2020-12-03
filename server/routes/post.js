const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const requireLogin=require('../middleWare/requireLogin')
const Post=mongoose.model("Post");


router.get('/allpost',requireLogin,(req,res)=>{
    Post.find({})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .then((post)=>{
        res.json(post);
    })
    .catch(err=>console.log(err));
})


router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .then((post)=>{
        res.json(post);
    })
    .catch(err=>console.log(err));
})


router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,photo}=req.body;

    if(!title || !body || !photo){
        return res.status(422).json({error:"please fill all the datails"});
    }
    //  console.log(req.user);
    // res.send('ok');
    req.user.password=undefined;//bcs dont want to show password;
    const post=new Post({
        title,
        body,
        photo,
        postedby:req.user
    })
    post.save()
    .then((result)=>res.json({post:result}))
    .catch((err)=>console.log(err))

})


router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then((mypost)=>{
        res.json({mypost});
    })
    .catch((err)=>console.log(err));
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId ,
       {
           $push:{likes:req.user._id}
       },{
           new:true
       }
        )
        .populate("postedby","_id name")
        .populate("comments.postedby","_id name")
        .exec((err,result)=>{
            if(err){
                res.status(422).json({error:err})
            }else{
                res.json(result);
            }

        })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId ,
       {
           $pull:{likes:req.user._id}
       },{
           new:true
       }
        )
        .populate("postedby","_id name")
        .populate("comments.postedby","_id name")
        .exec((err,result)=>{
            if(err){
                res.status(422).json({error:err})
            }else{
                res.json(result);
            }

        })
})


router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedby:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId ,
       {
           $push:{comments:comment}
       },{
           new:true
       }
        )
        .populate("postedby","_id name")
        .populate("comments.postedby","_id name")
        .exec((err,result)=>{
            if(err){
                res.status(422).json({error:err})
            }else{
                res.json(result);
            }

        })
})



router.put('/deletecomment/:postid/:commentid',requireLogin,(req,res)=>{
   
   
    const {postid,commentid}=req.params;
    //console.log(postid,commentid)
    const comment={
        text:req.body.text,
        postedby:commentid
    }
    Post.findByIdAndUpdate(postid,
       {
           $pull:{comments:comment}
       },{
           new:true
       }
        )
        .populate("postedby","_id name")
        .populate("comments.postedby","_id name")
        .exec((err,result)=>{
            console.log("SSSS ",result);
            if(err){
                res.status(422).json({error:err})
            }else{
                res.json(result);
            }

        })
})




router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    //console.log("@@@@@@@@@ Checking ", req.params.postId);
    Post.findOne({_id:req.params.postId})
    .populate("postedby","_id ")
    .exec((err,post)=>{
      //  console.log(post.postedby._id,req.user._id)
        if(err || !post){
           // console.log("###ERROR")
            return res.status(422).json({error:err})
        }
        if(post.postedby._id.toString()===req.user._id.toString())
        {
         //  console.log("** COME ** ")
            post.remove()
            .then(result=>res.json(result))
            .catch(err=>console.log(err));
            
        }

    })
})


module.exports=router;