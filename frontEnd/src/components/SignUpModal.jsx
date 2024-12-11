import React from 'react'
import './SignUpModal.css'

function SignUpModal() {


  return (
    <div className='signup_main'>
           <div className='signup_doctor'>
                <p>Doctor</p>
                <a href="" className='links'>Login</a>
                <a href="" className='links'>SignUp</a>
           </div>
           <div className='signup_patients'>
                <p>Patients</p>
                <a href="" className='links'>Login</a>
                <a href="" className='links'>SignUp</a>
           </div>
    </div>
  )
}

export default SignUpModal