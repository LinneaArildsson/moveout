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
        const response = await axios.get('https://moveout.onrender.com/users/admin', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

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
        // Display only users for admin
        <>
          <h3>All Users</h3>
          {error && <p className="error">{error}</p>}
          <ul>
            {users.map((user) => (
              <li key={user._id}>{user.name} - {user.email}</li>
            ))}
          </ul>
        </>
      ) : (
        // Display greeting, email, label form, and labels for regular users
        <>
          {greeting && <h2 className='greeting'>{greeting}</h2>}
          <p className='user-email'>{'Logged in: ' + user.email}</p>
          <LabelForm />
          <div className="label-container">
            {labels && labels.map(label => (
              <LabelDetails label={label} key={label._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}