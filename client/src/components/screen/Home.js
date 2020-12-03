import React, { useContext, useEffect, useState } from 'react'
import {userContext} from '../../App'
import {Link}  from 'react-router-dom'
const Home=()=>{
   const {state,dispatch}=useContext(userContext)
    const [data,setData]=useState([]);
    useEffect(()=>{
        console.log("XXXXXX ",state);
        fetch('http://localhost:5000/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        })
        .then((res)=>res.json())
        .then(result=>{
         //  console.log(result);
            setData(result);
        })
    },[])

    const likepost=(id)=>{
        //console.log("sahil seli is checking ",state)
        fetch('http://localhost:5000/like', {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            postId:id
        }),
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map((item)=>{  //this is bcs for change state and then useEffect willwork;
                if(item._id===result._id){
                  return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err));

    }
    const unlikepost=(id)=>{
        
        fetch('http://localhost:5000/unlike', {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            postId:id
        }),
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map((item)=>{  //this is bcs for change state and then useEffect willwork;
                if(item._id===result._id){
                  return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err));

    }

    const makeComment=(text,postId)=>{

        console.log(text,postId);
        fetch('http://localhost:5000/comment', {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            postId:postId,
            text:text
          
        }),
        })
        .then(res=>res.json())
        .then(result=>{
          //  console.result("comment***   ",result);
            const newData=data.map((item)=>{  //this is bcs for change state and then useEffect willwork;
                if(item._id===result._id){
                  return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err));
    }
     
    
    const deleteComment=(postid,commentid,text)=>{

      console.log(postid,commentid);
        fetch(`http://localhost:5000/deletecomment/${postid}/${commentid}`, {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            text:text
          
        }),
        })
        .then(res=>res.json())
        .then(result=>{
           console.log("comment***   ",result);
            const newData=data.map((item)=>{  //this is bcs for change state and then useEffect willwork;
                if(item._id===result._id){
                  return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err));
    }

    const deletePost=(postId)=>{
        console.log("click   **  ",postId);
        fetch(`http://localhost:5000/deletepost/${postId}`, {
            method: 'delete', // or 'PUT'
            headers: {
                'Authorization':'Bearer '+localStorage.getItem('jwt')
            },
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                const newData=data.filter((item)=>{
                    return item._id!==result._id;
                })
                setData(newData);
            })
            .catch(err=>console.log("error",err));
    }

    return(
        
          
             <div className="home">
             
             {
                data.map((item)=>{
                    return(
                        <div className="card card-type" key={item._id}>
                          <h5><Link to={item.postedby._id===state._id?'/profile':'/profile/'+item.postedby._id}>{item.postedby.name}</Link> { item.postedby._id===state._id &&  <i onClick={()=>deletePost(item._id)} className="material-icons" style={{float:"right"}}>delete</i>}</h5>
                          <div className="card-image">
                          <img src={item.photo} alt="Loading error"/>
                          </div>
                          <div className="card-content">
                            { item.likes.includes(state._id)?<i className="material-icons"style={{color:"red"}}>favorite</i>:<i className="material-icons" style={{color:"grey"}}>favorite</i> }
                             {item.likes.includes(state._id)?<i  onClick={()=>unlikepost(item._id)} className="material-icons">thumb_down</i>:<i  onClick={()=>likepost(item._id)} className="material-icons">thumb_up</i>}
                             <h6 >{item.likes.length+" Likes"}</h6>
                             <h5>{item.title}</h5>
                            <h6>{item.body}</h6>
                            {
                               item.comments.map((record)=>{
                                    return (<p key={record._id}><span style={{fontWeight:"bold"}}>{record.postedby.name+" " }</span>{record.text}<span>{ record.postedby._id===state._id &&  <i onClick={()=>deleteComment(item._id,record.postedby._id,record.text)}  className="material-icons" style={{float:"right"}}>delete</i>}</span> </p>)
                                })
                            }

                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                //console.log(e.target[0].value,item._id)
                                makeComment(e.target[0].value,item._id)
                            }}>
                               <input type="text" placeholder="Drop a comment"/>
                            </form>
                            
                          </div>
                       </div>
                    )
                })
             }
             
             </div>
          

        
    )

}

export default Home;