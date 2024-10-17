import { React, useState } from 'react';
import axios from 'axios';

import Modal from './Modal';

import { useLabelContext } from '../hooks/useLabelsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const LabelEditModal = ({ label, onClose }) => {
    const { dispatch } = useLabelContext();
    const { user } = useAuthContext();

    const [title, setTitle] = useState(label.title);
    const [textList, setTextList] = useState([...label.textList]);
    const [audioFiles, setAudioFiles] = useState([...label.audioFiles]);
    const [imageFiles, setImageFiles] = useState([...label.imageFiles]);
    const [newAudioFiles, setNewAudioFiles] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [removedAudioFiles, setRemovedAudioFiles] = useState([]);
    const [removedImageFiles, setRemovedImageFiles] = useState([]);
    const [error, setError] = useState(null);

    const handleCloseModal = () => {
        setTitle(label.title);
        setTextList([...label.textList]);
        setAudioFiles([...label.audioFiles]);
        setImageFiles([...label.imageFiles]);
        setRemovedAudioFiles([]);
        setRemovedImageFiles([]);
        onClose(); // Close the modal
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('textList', textList.join(','));

        // Append new files to formData
        newAudioFiles.forEach((file) => formData.append('audioFiles', file));
        newImageFiles.forEach((file) => formData.append('imageFiles', file));

        // Send removed file names/IDs for deletion
        formData.append('removedAudioFiles', removedAudioFiles.join(','));
        formData.append('removedImageFiles', removedImageFiles.join(','));

        try {
            const response = await axios.patch(`https://moveout.onrender.com/labels/${label._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Dispatch the updated label to the context
            dispatch({ type: 'UPDATE_LABEL', payload: response.data });
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error('Error updating label:', error);
            setError('An error occurred while updating the label.');
        }
    };

    const handleFileChange = (e, setFiles) => {
        setFiles([...e.target.files]);
    };

    const removeAudioFile = (index) => {
        const updatedAudioFiles = [...audioFiles];
        const removedFile = updatedAudioFiles.splice(index, 1)[0];
        setRemovedAudioFiles([...removedAudioFiles, removedFile]);
        setAudioFiles(updatedAudioFiles);
    };

    const removeImageFile = (index) => {
        const updatedImageFiles = [...imageFiles];
        const removedFile = updatedImageFiles.splice(index, 1)[0];
        setRemovedImageFiles([...removedImageFiles, removedFile]);
        setImageFiles(updatedImageFiles);
    };

    return (
        <div className='label-form-container'>
            <Modal isOpen={true} onClose={handleCloseModal}>
                <div className='edit-label'><h2>Edit Label</h2></div>
                <form onSubmit={handleSave}>
                    {/* Title Input */}
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    {/* Text List Input */}
                    <label>Content List</label>
                    {textList.map((item, index) => (
                        <div key={index}>
                            <input 
                                type="text" 
                                value={item} 
                                onChange={(e) => {
                                    const newTextList = [...textList];
                                    newTextList[index] = e.target.value;
                                    setTextList(newTextList);
                                }} 
                            />
                            <button onClick={() => setTextList(textList.filter((_, i) => i !== index))}>Delete</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setTextList([...textList, ''])}>Add Content</button>
                    {/* Existing Audio Files */}
                    <label>Existing Audio Files</label>
                    {audioFiles.map((file, index) => (
                        <div key={index}>
                            <span>{file}</span>
                            <button type="button" onClick={() => removeAudioFile(index)}>Remove</button>
                        </div>
                    ))}
                    {/* New Audio File Input */}
                    <label>Upload New Audio Files</label>
                    <input
                        type="file"
                        accept="audio/*"
                        multiple
                        onChange={(e) => handleFileChange(e, setNewAudioFiles)}
                    />
                    {/* Existing Image Files */}
                    <label>Existing Image Files</label>
                    {imageFiles.map((file, index) => (
                        <div key={index}>
                            <span>{file}</span>
                            <button type="button" onClick={() => removeImageFile(index)}>Remove</button>
                        </div>
                    ))}
                    {/* New Image File Input */}
                    <label>Upload New Image Files</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, setNewImageFiles)}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCloseModal}>Cancel</button>
                </form>
                {error && <p className="error">{error}</p>}
            </Modal>
        </div>
    );
};

export default LabelEditModal;
