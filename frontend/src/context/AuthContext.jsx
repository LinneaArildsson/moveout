import { React, createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload
            }
        case 'LOGOUT':
            return {
                user: null
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user:null
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
    
        // Check if the stored value is not null/undefined
        if (storedUser) {
            try {
                // Try to parse the stored value if it exists
                const user = JSON.parse(storedUser);

                //console.log('USER: ' + user)
    
                // If the parsing succeeds, dispatch the login action
                if (user) {
                    dispatch({ type: 'LOGIN', payload: user });
                }
            } catch (error) {
                console.error('Failed to parse user data from localStorage:', error);
            }
        }
    }, []);

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={({...state, dispatch})}>
            {children}
        </AuthContext.Provider>
    )
}