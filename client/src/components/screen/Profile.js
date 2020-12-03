import React, { useContext, useEffect, useState } from 'react'
import {userContext} from '../../App'

const Profile=()=>{
    const [data,setData]=useState([]);
    const {state,dispatch} =useContext(userContext)

    useEffect(()=>{
        console.log(state," <<<<")
        fetch('http://localhost:5000/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        })
        .then((res)=>res.json())
        .then(result=>{
            
            setData(result.mypost);
         //   console.log(result,"****",state);
        })
        .catch((err)=>console.log(err));

    },[])



    return(
        <>
        {state?
        <div style={{maxWidth:"1000px" ,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0",borderBottom:"2px solid black"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="loading error"/>
                </div>
                <div>
                    <h5> : {state?state.name:"loading"}</h5>
                    <h5> : {state?state.email:"loading"}</h5>
                    <div style={{display:"flex",justifyContent:"space-around",width:"130%"}}>
                        <div ><h6> {data?data.length:0} post </h6></div>
                        <div ><h6>{state?state.followers.length:"0"}   follower </h6></div>    
                        <div ><h6> {state?state.following.length:"0"} following </h6></div>
                       {/* {state?state.follower.length:"0"} 
                       { state?state.following.length:"0"} */}
                    </div>
                </div>
            </div>
             
            <div className="gallery">
            {
                 data.map((item)=>{
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