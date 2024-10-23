import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

// Hooks
import { useAuthContext } from '../hooks/useAuthContext';

export default function EmailForm() {
  const { user } = useAuthContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRecipientEmail('');
    setEmailSubject('');
    setEmailBody('');
    setError(null);
    setSuccessMessage('');
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    try {
        const response = await axios.post('https://moveout.onrender.com/user/admin/send-email', {
            recipientEmail,
            subject: emailSubject,
            body: emailBody,
        }, {
            headers: {
            'Authorization': `Bearer ${user.token}`,
            },
        });

        setSuccessMessage(response.data.message);
        setError(null);
        setRecipientEmail('');
        setEmailSubject('');
        setEmailBody('');

        setIsModalOpen(false);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred while sending the email');
      }
    }
  };

  return (
    <div className='email-sender-container'>
      <button className="modal-button" onClick={handleOpenModal}>Send Email</button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className='send-email'>
            <h2>Send Email to Users</h2>
            <form onSubmit={handleSendEmail}>
              <label>Recipient Email:</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />

              <label>Email Subject:</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                required
              />

              <label>Email Body:</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                required
              />

              <button className="modal-button-add" type="submit">Send Email</button>
              {error && <div className="error">{error}</div>}
              {successMessage && <div className="success">{successMessage}</div>}
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
