import { React, useEffect, useState } from 'react';
import axios from 'axios';

//hooks
import {useLabelContext} from '../hooks/useLabelsContext';
import {useAuthContext} from '../hooks/useAuthContext';

//components
import LabelDetails from '../components/LabelDetails';
import LabelForm from '../components/LabelForm';

export default function Home () {
  const {labels, dispatch} = useLabelContext();
  const {user} = useAuthContext();

  const [greeting, setGreeting] = useState('');

  const [users, setUsers] = useState([]); // State for storing users
  const [error, setError] = useState(''); // State for error handling

  // Function to toggle active status of a user
  const toggleActiveStatus = async (userId) => {
    try {
      await axios.patch(
        `https://moveout.onrender.com/admin/${userId}/isactive`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to update active status:', error);
      setError('Failed to update active status');
    }
  };

  useEffect(() => {
    const fetchLabels = async () => {
        try {
          const response = await axios.get('https://moveout.onrender.com/labels', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
    
          dispatch({type: 'SET_LABELS', payload: response.data})

        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://moveout.onrender.com/user/admin', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        console.log(response.data);
        setUsers(response.data); // Store fetched users in state
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users'); // Handle error
      }
    };
    
    if (user) {
      const nameToUse = user.name || user.email; // Use name if available, else use email
      setGreeting(`Welcome to MoveOut, ${nameToUse}!`);
      if (user.isAdmin) { // Only fetch users if the logged-in user is an admin
        fetchUsers();
      } else {
        fetchLabels(); // Fetch labels for regular users
      }
    }
  }, [dispatch, user])

  return (
    <div className="home">
      {user.isAdmin ? (
        // Display table of users and their labels for admin
        <div>
          <h3>All Users and Their Labels</h3>
          {error && <p className="error">{error}</p>}
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Status (Active)</th>
                <th>Storage Usage (Bytes)</th>
                <th>Labels</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || 'No name'}</td>
                  <td>{user.email}</td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{user.totalFileSize} Bytes</td>
                  <td>
                    <ul>
                      {user.labels && user.labels.length > 0 ? (
                        user.labels.map((label) => (
                          <li key={label._id}>{label.title || 'No title'}</li>
                        ))
                      ) : (
                        <li>No labels</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActiveStatus(user._id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Display greeting, email, label form, and labels for regular users
        <>
          {greeting && <h2 className="greeting">{greeting}</h2>}
          <p className="user-email">{'Logged in: ' + user.email}</p>
          <p className="user-email">Verified: {user.isVerified.toString()}</p>
          <p className="user-email">Active: {user.isActive.toString()}</p>
          {(!user.isVerified || !user.isActive) ? (
            <p>You need to have a verified and active account to create labels.</p>
          ) : (
            <LabelForm />
          )}
          <div className="label-container">
            {labels && labels.map((label) => (
              <LabelDetails label={label} key={label._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}