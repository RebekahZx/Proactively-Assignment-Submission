import React, { useState } from 'react';
import { IdCard, MapPin, Search } from 'lucide-react';
import './SearchModal.css';

function SearchModal() {
  const [formData, setFormData] = useState({
    condition: "",
    location: "",
    insurance: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      condition : "",
      location : "",
      insurance : ""
    })
  };

  return (
    <div className='search_main'>
      <div className='search_condition'> 
        <Search size={30} color='#8B8E9C' />
        <input  
          type="text"  
          placeholder='Condition, procedure, speciality...'
          name='condition'
          value={formData.condition}
          onChange={handleChange}
        />
      </div>

      <div className='search_location'> 
        <MapPin size={30} color='#8B8E9C' />
        <input  
          type="text" 
          placeholder='City, state, or zipcode'
          name='location'
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className='search_insurance'>
        <IdCard size={30} color='#8B8E9C' />
        <input  
          type="text" 
          placeholder='Insurance carrier'
          name='insurance'
          value={formData.insurance}
          onChange={handleChange}
        />
      </div>

      <div 
        className='search_submit'
        onClick={handleSubmit}
        role="button"
        tabIndex={0}
      >
        <Search size={30} color='#fff' />
        <p>Find now</p>
      </div>
    </div>
  );
}

export default SearchModal;