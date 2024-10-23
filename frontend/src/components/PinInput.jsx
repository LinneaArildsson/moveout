import React, { useState } from 'react';

export default function PinInput({ onSubmit }) {
  const [pin, setPin] = useState(''); // State to track the entered PIN

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    onSubmit(pin); // Calls the parent function to submit the entered PIN
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter PIN:
        <input 
          type="password" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} // Updates state with the input value
          maxLength="6" // Limits the input to a 6-digit PIN
          required 
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
