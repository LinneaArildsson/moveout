import React, { useState } from 'react';
import axios from 'axios';

export default function PinInput({ labelId }) {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://moveout.onrender.com/labels/verify-pin', {
        labelId,
        enteredPin,
      });
      if (response.data.success) {
        // onSuccess(response.data.label); // Call the success callback with the label data
      }
    } catch (err) {
      setError(err.response.data.error || 'Failed to verify PIN');
      // onError();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter PIN to Access Private Label:</label>
      <input
        type="text"
        value={enteredPin}
        onChange={(e) => setEnteredPin(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
