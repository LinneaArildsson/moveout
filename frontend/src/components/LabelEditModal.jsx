import React, { useState } from 'react';
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
        // Reset states
        setTitle(label.title);
        setTextList([...label.textList]);
        setAudioFiles([...label.audioFiles]);
        setImageFiles([...label.imageFiles]);
        setRemovedAudioFiles([]);
        setRemovedImageFiles([]);
        onClose();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append data to formData
        formData.append('title', title);
        formData.append('textList', JSON.stringify(textList)); // Send as JSON array
        newAudioFiles.forEach((file) => formData.append('audioFiles', file));
        newImageFiles.forEach((file) => formData.append('imageFiles', file));
        formData.append('removedAudioFiles', JSON.stringify(removedAudioFiles)); // Send as JSON array
        formData.append('removedImageFiles', JSON.stringify(removedImageFiles)); // Send as JSON array

        try {
            const response = await axios.patch(`https://moveout.onrender.com/labels/${label._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch({ type: 'UPDATE_LABEL', payload: response.data });
            onClose();
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
        setRemovedAudioFiles((prev) => [...prev, removedFile]);
        setAudioFiles(updatedAudioFiles);
    };

    const removeImageFile = (index) => {
        const updatedImageFiles = [...imageFiles];
        const removedFile = updatedImageFiles.splice(index, 1)[0];
        setRemovedImageFiles((prev) => [...prev, removedFile]);
        setImageFiles(updatedImageFiles);
    };

    return (
        <div className='label-form-container'>
            <Modal isOpen={true} onClose={handleCloseModal}>
                <div className='edit-label'><h2>Edit Label</h2></div>
                <form onSubmit={handleSave}>
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                    />
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
                                required
                            />
                            <button type="button" onClick={() => setTextList(textList.filter((_, i) => i !== index))}>Delete</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setTextList([...textList, ''])}>Add Content</button>
                    <label>Existing Audio Files</label>
                    {audioFiles.map((file, index) => (
                        <div key={index}>
                            <span>{file.name || file}</span> {/* Display file name */}
                            <button type="button" onClick={() => removeAudioFile(index)}>Remove</button>
                        </div>
                    ))}
                    <label>Upload New Audio Files</label>
                    <input
                        type="file"
                        accept="audio/*"
                        multiple
                        onChange={(e) => handleFileChange(e, setNewAudioFiles)}
                    />
                    <label>Existing Image Files</label>
                    {imageFiles.map((file, index) => (
                        <div key={index}>
                            <span>{file.name || file}</span> {/* Display file name */}
                            <button type="button" onClick={() => removeImageFile(index)}>Remove</button>
                        </div>
                    ))}
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
