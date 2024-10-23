import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import MultiMediaPlayer from './MultiMediaPlayer';

export default function LabelView() {
  const { id } = useParams(); // Get the label ID from the URL params
  const [label, setLabel] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        console.log("Label ID: ", id);
        // Replace with your QR code URL if needed
        const response = await axios.get(`https://moveout.onrender.com/labels/${id}`);
        console.log(response.data);
        setLabel(response.data); // Set the fetched data to state
      } catch (error) {
        setError('Error fetching label data');
      }
    };

    fetchLabel();
  }, [id]); // Fetch label when component mounts or ID changes

  if (error) {
    return <div>{error}</div>; // Display error if any
  }

  if (!label) {
    return <div>Loading...</div>; // Loading state while fetching data
  }

  return (
    <div className="label-view-container" style={{ border: getBorderColor(label.design) }}>
      <h1>{label.title}</h1>
      <p>ID: {id}</p>
      
      <div className="label-design">
        <strong>Design:</strong> <span>{label.design}</span>
      </div>

      <div className="label-content">
        <strong>Contents:</strong>
        <ul>
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
  );
}
