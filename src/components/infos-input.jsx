import React from 'react';


const InfosInput = () => {
  return ( 
    <div>
      <label for="info-area">Secret informations: </label>

      <textarea id="info-area" name="info-area" rows="4" cols="50">      
        Enter your informations here
      </textarea>
    </div>
)
}

export default InfosInput;