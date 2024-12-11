import React, { useState } from 'react'
import './Navbar.css'
import { ChevronDown } from 'lucide-react';
import SignUpModal from './SignUpModal';

function Navbar() {

    const [toggleSignUpModal,setToggleSignUpModal] = useState(false);

    const navdata = ["List your practice",
                     "For Employers",
                     "Courses",
                     "Books",
                     "Speakers",
                     "Doctors" 
    ];

  return (
    <div className='main'>
        {toggleSignUpModal && <SignUpModal/>}
        <div className='logo'>
            <img src="./icons/MainLogo.svg" alt="alt" />
            <h2>ProVital</h2>
        </div>
        <div className='navContent'>
            {navdata.map((data,idx)=>(
                <div key={idx} className='navItem'>
                    {data} 
                </div>
            ))}
            <div style={{paddingLeft : "15px", display : "flex"}} 
                 className='loginButton'
                 onClick={()=>setToggleSignUpModal(!toggleSignUpModal)}> 
                Login/SignUp
                <ChevronDown size={"20px"} style={{padding:"3px 0px 0px 5px"}}/>
            </div>
        </div>
    </div>
  )
}

export default Navbar