import { useState } from 'react';
import axios from 'axios';

const LabelEditModal = ({ label, onClose, onSave }) => {
  const [title, setTitle] = useState(label.title);
  const [textList, setTextList] = useState([...label.textList]);
  const [audioFiles, setAudioFiles] = useState([...label.audioFiles]);
  const [imageFiles, setImageFiles] = useState([...label.imageFiles]);
  const [newAudioFiles, setNewAudioFiles] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('textList', textList.join(','));

    // Append new files to formData
    newAudioFiles.forEach((file) => formData.append('audioFiles', file));
    newImageFiles.forEach((file) => formData.append('imageFiles', file));

    try {
      await axios.patch(`https://moveout.onrender.com/labels/${label._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      onSave({ title, textList, audioFiles, imageFiles });
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating label:', error);
    }
  };

  const handleFileChange = (e, setFiles) => {
    setFiles([...e.target.files]);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Label</h2>

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
        <button onClick={() => setTextList([...textList, ''])}>Add Content</button>

        {/* Audio File Input */}
        <label>Upload New Audio Files</label>
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={(e) => handleFileChange(e, setNewAudioFiles)}
        />

        {/* Image File Input */}
        <label>Upload New Image Files</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(e, setNewImageFiles)}
        />

        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default LabelEditModal;
