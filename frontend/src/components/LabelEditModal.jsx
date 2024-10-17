import { React, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { useLabelContext } from '../hooks/useLabelsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import editIcon from '../style/edit.png';

export default function LabelEditModal({ label }) {
  const { dispatch } = useLabelContext();
  const { user } = useAuthContext();

  // Set initial states with label data
  const [title, setTitle] = useState(label.title || '');
  const [design, setDesign] = useState(label.design || '');
  const [contentType, setContentType] = useState('text');
  const [textList, setTextList] = useState(label.textList.join('\n') || ''); // Assuming textList is an array
  const [imageFiles, setImageFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setTitle('');
    setDesign('');
    setTextList('');
    setImageFiles([]);
    setAudioFiles([]);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('design', design);
    formData.append('contentType', contentType);

    if (contentType === 'text') {
      formData.append('textList', textList.split('\n')); // Convert text to array
    }

    if (contentType === 'image') {
      Array.from(imageFiles).forEach((file) => {
        formData.append('imageFiles', file);
      });
    }

    if (contentType === 'audio') {
      Array.from(audioFiles).forEach((file) => {
        formData.append('audioFiles', file);
      });
    }

    try {
      const response = await axios.patch(`https://moveout.onrender.com/labels/${label._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      setError(null);
      dispatch({ type: 'UPDATE_LABEL', payload: response.data });
      handleCloseModal(); // Close the modal after submission

    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
        setEmptyFields(error.response.data.emptyFields || []);
      } else {
        setError('An error occurred while updating the label');
      }
    }
  };

  return (
    <div className='label-form-container'>
      <button className="edit-icon" onClick={handleOpenModal} aria-label="Edit label">
        <img src={editIcon} alt="Edit" className="edit-icon-img" />
      </button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className='edit-label'><h2>Edit Label</h2></div>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes('title') ? 'error' : ''}
          />

          <label>Select Design:</label>
          <div className='radio-group'>
            {['design1', 'design2', 'design3'].map((designOption) => (
              <div key={designOption}>
                <input
                  type="radio"
                  value={designOption}
                  checked={design === designOption}
                  onChange={() => setDesign(designOption)}
                />
                <label>{designOption.replace('design', 'Design ')}</label>
              </div>
            ))}
          </div>

          <label>Content Type:</label>
          <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
          </select>

          {contentType === 'text' && (
            <div>
              <label>Text List:</label>
              <textarea
                onChange={(e) => setTextList(e.target.value)}
                value={textList}
                className={emptyFields.includes('textList') ? 'error' : ''}
              />
            </div>
          )}

          {contentType === 'image' && (
            <div>
              <label>Upload Images:</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
              />
            </div>
          )}

          {contentType === 'audio' && (
            <div>
              <label>Upload Audio Files:</label>
              <input
                type="file"
                multiple
                accept="audio/*"
                onChange={(e) => setAudioFiles(e.target.files)}
              />
            </div>
          )}

          <button className="modal-button-add" type="submit">Save Changes</button>
          {error && <div className="error">{error}</div>}
        </form>
      </Modal>
    </div>
  );
};
