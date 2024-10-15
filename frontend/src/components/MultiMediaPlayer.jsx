import React from 'react';

const MultiMediaPlayer = ({ mediaFiles }) => {
    return (
        <div className="media-container">
            {mediaFiles.map((file, index) => {
                const extension = file.split('.').pop().toLowerCase();
                const fullPath = `https://moveout.onrender.com/${file}`; // Adjust the base path as needed

                console.log(fullPath); // Log the full path for debugging

                if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                    // Render images
                    return (
                        <div key={index} className="media-item">
                            <img src={fullPath} alt={`Media ${index}`} className="media-image" />
                        </div>
                    );
                } else if (['mp3', 'wav'].includes(extension)) {
                    // Render audio players
                    return (
                        <div key={index} className="media-item">
                            <p>{file.split('\\').pop()}</p>
                            <audio controls>
                                <source src={fullPath} type={`audio/${extension}`} />
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    );
                } else {
                    return null; // If the file type is unsupported
                }
            })}
        </div>
    );
};


export default MultiMediaPlayer;
