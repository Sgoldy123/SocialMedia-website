import React, { useContext, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {userContext} from '../../App'

const SignIn=()=>{

    const {state,dispatch} =useContext(userContext);

    const history=useHistory();
    const [data,updateData]=useState({
        email:"",
        password:""
    });

    const authDetail=(e)=>{

       const nam=e.target.name;
       const val=e.target.value;
       console.log(nam,val);
       updateData((prev)=>{
        return {
            ...prev,
            [nam]:val
        }
    })

    }
    const click=(e)=>{
        e.preventDefault();
        fetch('http://localhost:5000/signin', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data.user);
            if(data.error){
                M.toast({html: data.error})
            }
            else{
              
                localStorage.setItem('jwt',data.token);
                localStorage.setItem('user',JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user});
                 console.log("### "+data.user);
            
              M.toast({html: "successfully login"})
              history.push('/')

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
                    <input onChange={authDetail} name="email" type="text" placeholder="E-mail"/>
                    <input onChange={authDetail} name="password" type="password" placeholder="Password"/>
                    <button onClick={click} className="btn #2196f3 blue">SignIn
                    </button>
                    <h6>
                           <Link to="/signup">Create an account?</Link>
                    </h6>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )

}

export default SignIn;