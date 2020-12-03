import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {userContext} from '../../App'

const Profile=()=>{
    
    const [userProfile,setProfile]=useState(null);
    const {state,dispatch} =useContext(userContext)
  //  console.log("please hepl " ,state && state.followers.length)
    const {id}=useParams();
    const [showfollow,setfollow]=useState(true);

    useEffect(()=>{
        console.log("SA ",state);
        if(state)
        {
            setfollow(!state.following.includes(id))
        }
       
        fetch(`http://localhost:5000/user/${id}`,{
            method:"GET",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        })
        .then((res)=>res.json())
        .then(result=>{
           // console.log(result);
             setProfile(result);
        })
        .catch((err)=>console.log(err));

    },[])

    const followUser=()=>{
        fetch('/follow', {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization':"Bearer "+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            followId:id  //this is a user Id;
        }),
        })
        .then(res=>res.json())
        .then(result=>{console.log(result)
        dispatch({type:"UPDATE",payload:{following:result.following},followers:result.followers});  
      
        localStorage.setItem("user",JSON.stringify(result));
        setProfile((prev)=>{
            return{
                ...prev,
                user:{
                    ...prev.user,
                    followers:[...prev.user.followers,result._id]
                }
            }
        })
      
        setfollow(false)

        })
        .catch(err=>console.log(err));
    }
    
    const unfollowUser=()=>{
        fetch('/unfollow', {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization':"Bearer "+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            unfollowId:id  //this is a user Id;
        }),
        })
        .then(res=>res.json())
        .then(result=>{console.log(result)
        dispatch({type:"UPDATE",payload:{following:result.following},followers:result.followers});  
        localStorage.setItem("user",JSON.stringify(result));
        setProfile((prev)=>{
            const newFollower=prev.user.followers.filter(item=>item!=result._id)
            return{
                ...prev,
                user:{
                    ...prev.user,
                    followers:newFollower
                }
            }
        })
        setfollow(true)
        })
        .catch(err=>console.log(err));
    }


    return(
        <>
       { userProfile?
        <div style={{maxWidth:"1000px" ,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0",borderBottom:"2px solid black"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="loading error"/>
                </div>
                <div>
                    <h5>  {userProfile.user.name}</h5>
                    <h5>  {userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-around",width:"130%"}}>
                        <div ><h6> {userProfile?userProfile.post.length:0} post </h6></div>
                        <div ><h6> {userProfile?userProfile.user.followers.length:0} follower </h6></div>
                        <div ><h6>{userProfile?userProfile.user.following.length:0}  following </h6></div>
                    </div>
                    { showfollow ?<button style={{margin:"5px"}} onClick={()=>followUser()} className="btn #2196f3 blue">Follow
                    </button>:
                    <button onClick={()=>unfollowUser()} style={{margin:"10px"}} className="btn #2196f3 blue">UnFollow
                    </button>}
                    
                </div>
            </div>
             
            <div className="gallery">
            {
                 userProfile.post.map((item)=>{
                     return(<>
                         <img  key={item._Id} className="galleryImage" src={item.photo} alt="loading error"/>
                         </>)
                 })
            }
                    
           </div>

        </div>
        :<h2>loading.....</h2>}
        </>
    )

}

export default Profile;