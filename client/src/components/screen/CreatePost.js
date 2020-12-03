import React, { useEffect, useState } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom';

const CreatePost=()=>{
    const history=useHistory();
    const [title,setTitle]=useState('');
    const [body,setBody]=useState('');
    const [image,setImage]=useState('');
    const [url,setUrl]=useState('');
    useEffect(()=>{

        if(url){
        fetch('http://localhost:5000/createpost', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            title,
            body,
            photo:url
        }),
        })
        .then((response)=>response.json())
        .then((data)=>{
            // console.log(data.user);
            if(data.error){
                M.toast({html: data.error})
            }
            else{
             
              M.toast({html: "successfully upload"})
              history.push('/')
            }
        } )
        .catch((err)=>console.log('Error:',err));}

    },[url])

    const postDetail=(e)=>{
        e.preventDefault();
        const data =new FormData();
        data.append('file',image);
        data.append('upload_preset','insta-clone');
        data.append('cloud_name',"sahilssx");
       
     fetch('https://api.cloudinary.com/v1_1/sahilssx/image/upload', {
      method: 'PUT',
      body: data
      })
     .then(response => response.json())
     .then(result => {
       
       setUrl(result.url);
      // console.log('Success:', url);
     })
    .catch(error => {
     console.error('Error:', error);
    });

    }

    return(
       
            <div className="card card-post">
                <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" placeholder="title"/>
                <input value={body} onChange={(e)=>setBody(e.target.value)} type="text" placeholder="body"/>
                <div className="file-field input-field">
                    <div className="btn #2196f3 blue">
                        <span>Image</span>
                        <input onChange={(e)=>setImage(e.target.files[0])} type="file"/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button onClick={postDetail} style={{marginLeft:"190px" ,color:"black"}} className="btn #2196f3 blue">Post</button>
            </div>
        
    )

}

export default CreatePost;