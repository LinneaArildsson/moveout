import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import MultiMediaPlayer from './MultiMediaPlayer';

export default function LabelView() {
  const { id } = useParams(); // Get the label ID from the URL params
  const [label, setLabel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        // Replace with your QR code URL if needed
        const response = await axios.get(`https://moveout.onrender.com/labels/${id}`);
        setLabel(response.data); // Set the fetched data to state
        console.log(response.data);
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
    <div className="label-view-container">
      <h1>{label.title}</h1>
      
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
