import React, { useRef, useState } from 'react'
import './Landing.css'
import Card from '../components/Card';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import tagData from '../data/tagData';
import sixPillerData from '../data/sixPillerData';
import scrollDownData from '../data/scrollDownData'
import scrollUpData from '../data/scrollUpData'
import SearchModal from '../components/SearchModal';


function Landing() {

  const [activeTag,setActiveTag] = useState('Nutrition');
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 360; 
      const newScrollPosition = direction === 'left' 
        ? sliderRef.current.scrollLeft - scrollAmount
        : sliderRef.current.scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const tagStyle = {
    backgroundColor : "#000",
    color : "#FFF"
  };


  return (
    <div className='landmain'>
      <div className='upperHalf'>
        <SearchModal/>
        <div className='imagediv'>
          <div className='imageContainer Downscroll'>
            {scrollDownData.map((val , idx)=>(<img key={idx} src={val} className={`down_image_${idx}`}/>))}
          </div>
          <div className='imageContainer Upscroll'>
          {scrollUpData.map((val , idx)=>(<img key={idx} src={val} className={`up_image_${idx}`}/>))}
          </div>
          </div>
        <div className='titleText'>
        <p className='title'>Book an appointment with <br /> <span style={{color:"cyan"}}>lifestyle medicine</span> experts</p>
        <p className='subtitle'> Optimize your lifestyle and reverse chronic diseases.</p>
        </div>
      </div>
      <div className='lowerHalf'>
        <p className='lower_title_sub'>HOW IT WORKS</p>
        <div className='lower_title_section'>
          <p className='lower_title_main'><span className='lower_title_gradient_text'>Lifestyle as medicine :</span>The six pillars</p>
          <div className='hori_button_holder'>
            <button className='left_button' onClick={()=>scroll('left')}><ArrowLeft color='#707070' size={18}/></button>
            <button className='right_button' onClick={()=>scroll('right')}><ArrowRight color='#707070' size={18}/></button>
          </div>
        </div>
        <div className='tag_holder'>
          {tagData.map((val , idx)=>(
            <div className='tag'
                 style={val===activeTag? tagStyle : {}}
                 onClick={()=>{setActiveTag(val)}}
                 key={idx} 
            >{val}</div>
          ))}
        </div>
        <div className='slider_content' ref={sliderRef}>  
            {sixPillerData.map((val,idx) => (<Card data = {val} key={idx}/>))}
        </div>
      </div>
    </div>
  )
}

export default Landing