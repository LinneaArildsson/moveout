import axios from "axios";
import {React} from 'react';
import { useLabelContext } from "../hooks/useLabelsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import MultiMediaPlayer from './MultiMediaPlayer';

//style
import deleteIcon from '../style/trash.png';
import LabelEditModal from "./LabelEditModal";

import generalImg from '../style/storage.png';
import heavyImg from '../style/heavy.png';
import fragileImg from '../style/fragile.png';

const LabelDetails = ({label}) => {
    const {dispatch} = useLabelContext();
    const {user} = useAuthContext();

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
            return '';
        }
    };

    const handleClick = async () => {
        if (!user) {
            return
        }
        try {
            const response = await axios.delete(`https://moveout.onrender.com/labels/${label._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.status === 200) {
                dispatch({ type: 'DELETE_LABEL', payload: label });
            }
        } catch (error) {
            console.error('Error deleting label:', error);
        }
    }

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        
        const qrCodeSrc = label.qrcode; // Store the QR code URL
    
        // Create an image to preload the QR code
        const qrCodeImage = new Image();
        const designImage = new Image();
        qrCodeImage.src = qrCodeSrc;
        designImage.src = getDesignImage(label.design);

        qrCodeImage.onload = () => {
            designImage.onload = () => {
                // When both images are loaded, print the content
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>${label.title}</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 20px;
                                    text-align: center;
                                }
                                .label-container {
                                    border: 5px solid ${label.design === 'General' ? 'blue' : label.design === 'Fragile' ? 'green' : 'red'};
                                    padding: 20px;
                                    border-radius: 8px;
                                    margin-bottom: 20px;
                                }
                                .design-image, .qr-code {
                                    margin: 20px 0;
                                }
                                img {
                                    max-width: 100%;
                                    height: auto;
                                }
                                .design-image img {
                                    margin: 0 auto;
                                    max-width: 100px;
                                    height: auto;
                                }
                                @media print {
                                    .delete-icon {
                                        display: none;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="label-container">
                                <h1>${label.title}</h1>
                                <h2>${label.design}</h2>
                                <div class="design-image">
                                    <img src="${designImage.src}" alt="Design Image" />
                                </div>
                                <div class="qr-code">
                                    <img src="${qrCodeSrc}" alt="QR Code" />
                                </div>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            };

            designImage.onerror = () => {
                console.error('Error loading design image');
                printWindow.close(); // Close the window if the image fails to load
            };
        };

        qrCodeImage.onerror = () => {
            console.error('Error loading QR code image');
            printWindow.close(); // Close the window if the image fails to load
        };
    };
    

    return (
        <div className="label-container">
            <div className="label-details" style={{ border: getBorderColor(label.design) }}>
                <h4>{label.title}</h4>

                <p><strong>Visability: </strong>{label.isPrivate ? 'Private' : 'Public'}</p>
                <p><strong>PIN: </strong>{label.isPrivate ? label.pin : 'Not needed'}</p>

                <p><strong>Design: </strong>{label.design}</p>
                
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

                {/* Displaying the content list */}
                <p><strong>Content:</strong></p>
                <ul className="label-list">
                    {label.textList.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

                {/* Display audio and images */}
                <MultiMediaPlayer 
                    mediaFiles={[...label.audioFiles, ...label.imageFiles]} 
                />

                <div className="qr-code">
                    <img src={label.qrcode} alt="QR Code" /> {/* Ensure this is correctly accessing label.qrcode */}
                </div>

                <p className="date-since-created">{formatDistanceToNow(new Date(label.createdAt), { addSuffix: true })}</p>

                <button className="print-label" onClick={handlePrint}>Print Label</button>

                <div className="icon-container">
                    <LabelEditModal label={label} />

                    <button className="delete-icon" onClick={handleClick} aria-label="Delete label">
                        <img src={deleteIcon} alt="Delete" className="delete-icon-img" />
                    </button>
                </div>

            </div>
        </div>       
    )
}

export default LabelDetails