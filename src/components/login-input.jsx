import React from 'react';

const LoginInput = ({ typeInput }) => {
  return ( 
    <div>
      <input type={typeInput} id={typeInput} name={typeInput} />
    </div>
)
}

export default LoginInput;