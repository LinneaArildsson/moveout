import { useState } from "react";
import {useAuthContext} from './useAuthContext';
import axios from "axios";

export const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {dispatch} = useAuthContext();

    const register = async (email, name, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = axios.post('https://moveout.onrender.com/user/register', {
                email,
                name,
                password
            });
            
            localStorage.setItem('user', JSON.stringify((await response).data));

            dispatch({type: 'LOGIN', payload: response.data});

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error.response ? error.response.data.error : 'An error occured');
        }
    };

    return {register, isLoading, error};
}