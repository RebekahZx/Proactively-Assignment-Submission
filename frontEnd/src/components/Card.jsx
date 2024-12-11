import React from 'react'
import './Card.css'

function Card({data}) {
  return (
    <div className='card_main'>
        <img className='card_image' src={data.img} alt=''/>
        <div className='card_description'>
            <h2>{data.heading}</h2>
            <p>{data.desc}</p>
        </div>
    </div>
  ) 
}

export default Card