import React, { useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const SignUp=()=>{

    const history=useHistory();
     
    const [data,updateData]=useState({
        name:"",
        email:"",
        password:""
    });

    const authDetail=(e)=>{

       const nam=e.target.name;
       const val=e.target.value;
       updateData((prev)=>{
           return {
               ...prev,
               [nam]:val
           }
       })
    }
    const click=(e)=>{
        e.preventDefault();
        console.log("+++ "+data.name,data.email,data.password);
         
        if(! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email))
         {
            M.toast({html: "Invalid Email"});
            return ;
         }

        fetch('http://localhost:5000/signup', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            if(data.message){
                M.toast({html: data.message})
            }
            if(data.message=='successfully registered')
            {
                history.push('/signin')
                M.toast({html: "successfully registered"})
            }
        } )
        .catch((err)=>console.log('Error:',err));



    }





    return(
        <div className="mycard">
             <div className="row">
                <div className="col-md-6">
                <div className="card  auth-card ">
                    <div className="card-content input-field">
                    <span className="card-title insta">Instagram</span>
                    <input onChange={authDetail} name="name" value={data.name} type="text" placeholder="Name"/>
                    <input onChange={authDetail} name="email" value={data.email} type="text" placeholder="E-mail"/>
                    <input onChange={authDetail} name="password" value={data.password} type="password" placeholder="Password"/>
                    <button onClick={click} className="btn #2196f3 blue">Signup
                    </button>
                    <h6>
                           <Link to="/signin">Already have an account?</Link>
                    </h6>
                    
                    </div>
                </div>
                </div>
            </div>
        </div>
    )

}

export default SignUp;