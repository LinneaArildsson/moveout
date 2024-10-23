import axios from "axios";
import {React} from 'react';
import { useLabelContext } from "../hooks/useLabelsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import MultiMediaPlayer from './MultiMediaPlayer';

//style
import deleteIcon from '../style/trash.png';
import LabelEditModal from "./LabelEditModal";

const LabelDetails = ({label}) => {
    const {dispatch} = useLabelContext();
    const {user} = useAuthContext();

    const getBorderColor = (design) => {
        switch (design) {
            case 'General':
                return '2px solid blue';
            case 'Heavy':
                return '2px solid red';
            case 'Fragile':
                return '2px solid green';
            default:
                return '2px solid gray';  // Default border color if no design is matched
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
        qrCodeImage.src = qrCodeSrc;
    
        qrCodeImage.onload = () => {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${label.title}</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                            }
                            .label-container {
                                text-align: center; /* Center align the content */
                            }
                            .qr-code {
                                margin: 20px 0;
                            }
                            @media print {
                                .delete-icon {
                                    display: none; /* Hide delete icon during print */
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="label-container">
                            <h1>${label.title}</h1>
                            <h2>${label.design}</h2>
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
    
        qrCodeImage.onerror = () => {
            console.error('Error loading QR code image');
            printWindow.close(); // Close the window if the image fails to load
        };
    };
    

    return (
        <div className="label-container">
            <div className="label-details" style={{ border: getBorderColor(label.design) }}>
                <h4>{label.title}</h4>
                <p><strong>Design: </strong>{label.design}</p>

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