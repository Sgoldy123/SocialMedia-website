import React, { useContext } from 'react'
import {Link, useHistory}  from 'react-router-dom'
import {userContext} from '../App'

const Navbar=()=>{
    const {state,dispatch}=useContext(userContext);
    const history =useHistory();
    return(
        <>
        <nav>
                <div className="nav-wrapper white">
               <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                  
                  
                   {!state && <li><Link to='signin'>SignIn</Link></li>}
                   {!state &&   <li><Link to='signup' >SignUp</Link></li>}
                    {state && <li><Link to='createpost' >Upload</Link></li>}
                   {state && <li><Link to='profile' >Profile</Link></li>}
                   {state && <li>  <button onClick={()=>{
                       localStorage.clear();
                       dispatch({type:"CLEAR"});
                       history.push('/signin')
                      
                   }} className="btn #2196f3 blue">LogOut</button></li>}

                    
                </ul>
                </div>
       </nav>
        </>
    )

}

export default Navbar;