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

          console.log("USER TOKEN: ", user.token)
    
          dispatch({type: 'SET_LABELS', payload: response.data})

        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };
    
    if (user) {
      fetchLabels();
      const nameToUse = user.name || user.email; // Use name if available, else use email
      setGreeting(`Welcome to MoveOut, ${nameToUse}!`);
    }
  }, [dispatch, user])

  return (
    <div className="home">
      {greeting && <h2 className='greeting'>{greeting}</h2>}
      <p className='user-email'>{'Logged in: ' + user.email}</p>
      <LabelForm />
      <div className="label-container">
        {labels && labels.map(label=> (
          <LabelDetails label={label} key={label._id} />
        ))}
      </div>
    </div>
  )
}