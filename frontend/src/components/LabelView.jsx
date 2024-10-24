import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import MultiMediaPlayer from './MultiMediaPlayer';

import PinInput from './PinInput';

import generalImg from '../style/storage.png';
import heavyImg from '../style/heavy.png';
import fragileImg from '../style/fragile.png';

export default function LabelView() {
  const { id } = useParams(); // Get the label ID from the URL params
  const [label, setLabel] = useState(null);
  const [error, setError] = useState(null);

  const [pinRequired, setPinRequired] = useState(false); // To track if PIN is required
  const [pinVerified, setPinVerified] = useState(false); // Track if PIN is verified
  const [enteredPin, setEnteredPin] = useState(""); // Store the PIN entered by the user

  const getBorderColor = (design) => {
    switch (design) {
        case 'General':
            return '4px solid blue';
        case 'Heavy':
            return '4px solid red';
        case 'Fragile':
            return '4px solid green';
        default:
            return '4px solid gray';
    }
  };

  const getDesignImage = (design) => {
    switch (design) {
      case 'General':
        return generalImg;
      case 'Heavy':
        return heavyImg;
      case 'Fragile':
        return fragileImg;
      default:
        return null;
    }
  };

  const handlePinSubmit = async (pin) => {
    try {
      const response = await axios.post(`https://moveout.onrender.com/labels/verify-pin`, {
        labelId: id,
        enteredPin: pin
      });
      
      if (response.data.success) {
        setPinVerified(true); // Set pinVerified to true when the correct PIN is entered
        setLabel(response.data.label); // Set the label data
      } else {
        setError("Invalid PIN. Please try again.");
      }
    } catch (error) {
      setError('Error verifying PIN');
    }
  };

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        console.log("Label ID: ", id);
        // Replace with your QR code URL if needed
        const response = await axios.get(`https://moveout.onrender.com/labels/${id}`);
        console.log(response.data);
        if (response.data.isPrivate) {
          setPinRequired(true); // If the label is private, show PIN input
        } else {
          setLabel(response.data); // Set label if no PIN is needed
        }
      } catch (error) {
        setError('Error fetching label data');
      }
    };

    fetchLabel();
  }, [id]); // Fetch label when component mounts or ID changes

  if (error) {
    return <div>{error}</div>; // Display error if any
  }

  if (pinRequired && !pinVerified) {
    // If the label is private and PIN hasn't been verified, show the PIN input
    return <PinInput onSubmit={handlePinSubmit} />;
  }

  if (!label) {
    return <div>Loading...</div>; // Loading state while fetching data
  }

  return (
    <div>
      <div className="label-view-container" style={{ border: getBorderColor(label.design) }}>
        <h1>{label.title}</h1>

        <p><strong>Visability: </strong>{label.isPrivate ? 'Private' : 'Public'}</p>
        <p><strong>PIN: </strong>{label.isPrivate ? label.pin : 'Not needed'}</p>
        
        <div className="label-design">
          <strong>Design:</strong> <span>{label.design}</span>
        </div>

        <div className="design-image" style={{ textAlign: 'center' }}>
          <img 
            src={getDesignImage(label.design)} 
            alt={label.design} 
            style={{ 
              maxWidth: '40px',  // Adjust the size here
              display: 'block',   // Block-level element for centering
              margin: '10px auto' // Centers the image horizontally with auto margins
            }} 
          />
        </div>

        <div className="label-content">
          <strong>Contents:</strong>
          <ul className="label-list">
            {label.textList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          {/* Display audio and images */}
          <MultiMediaPlayer 
              mediaFiles={[...label.audioFiles, ...label.imageFiles]} 
          />
        </div>

        <div className="qr-code">
          <img src={label.qrcode} alt="QR Code" />
        </div>
      </div>
    </div>
  );
}
