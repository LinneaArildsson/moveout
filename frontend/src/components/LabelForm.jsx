import { React, useState } from 'react';
import axios from 'axios';

import Modal from './Modal';

//hooks
import { useLabelContext } from '../hooks/useLabelsContext';
import { useAuthContext } from '../hooks/useAuthContext';

export default function LabelForm () {
  const {dispatch} = useLabelContext();
  const {user} = useAuthContext();

  const [title, setTitle] = useState('');
  const [design, setDesign] = useState('');
  const [contentType, setContentType] = useState('text'); // text, image, audio
  const [textList, setTextList] = useState(''); // For text content
  const [imageFiles, setImageFiles] = useState([]); // For multiple image files
  const [audioFiles, setAudioFiles] = useState([]); // For multiple audio files
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in')
      return
    }

    // Creating FormData to send files
    const formData = new FormData();
    formData.append('title', title);
    formData.append('design', design);
    formData.append('contentType', contentType);

    if (contentType === 'text') {
      formData.append('textList', textList);
    }

    // Append multiple image files if they exist
    if (contentType === 'image') {
      Array.from(imageFiles).forEach((file) => {
        formData.append('imageFiles', file);
      });
    }

    // Append multiple audio files if they exist
    if (contentType === 'audio') {
      Array.from(audioFiles).forEach((file) => {
        formData.append('audioFiles', file);
      });
    }

    try {
      const response = await axios.post('https://moveout.onrender.com/labels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        }
      });

      setError(null);
      setTitle('');
      setDesign('');
      setTextList('');
      setImageFiles([]);
      setAudioFiles([]);
      setEmptyFields([]);
      console.log('New label added:', response.data);
      dispatch({type: 'CREATE_LABEL', payload: response.data});
      
      if(response.data.qrcode) {
        console.log('QR code: ', response.data.qrcode);
        alert('QR code generated successfully!');
      }

      setIsModalOpen(false);

    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
        setEmptyFields(error.response.data.emptyFields || []);
      } else {
        setError('An error occurred while adding the label');
        setEmptyFields([]);
      }
    }
  };

  return (
    <div className='label-form-container'>
      <button className="modal-button" onClick={handleOpenModal}>Create New Label</button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className='create-label'><h2>Create New Label</h2></div>
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
            <input
              type="radio"
              value="General"
              checked={design === 'General'}
              onChange={() => setDesign('General')}
            />
            <label>Design 1</label>
          </div>
          <div className='radio-group'>
            <input
              type="radio"
              value="Heavy"
              checked={design === 'Heavy'}
              onChange={() => setDesign('Heavy')}
            />
            <label>Design 2</label>
          </div>
          <div className='radio-group'>
            <input
              type="radio"
              value="Fragile"
              checked={design === 'Fragile'}
              onChange={() => setDesign('Fragile')}
            />
            <label>Design 3</label>
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

          <button className="modal-button-add" type="submit">Add Label</button>
          {error && <div className="error">{error}</div>}
        </form>
      </Modal>
    </div>
  );
};
