import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {dispatch} = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try{
            const response = await axios.post('http://localhost:5000/user/login', {
                email,
                password
            });

            localStorage.setItem('user', JSON.stringify((await response).data));

            dispatch({type: 'LOGIN', payload: response.data});

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error.response ? error.response.data.error : 'An error occured');
        }
    }

    return {login, error, isLoading};
}