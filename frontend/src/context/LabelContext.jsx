import { React, createContext, useReducer } from "react";

export const LabelContext = createContext();

export const labelsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LABELS':
            return {
                labels: action.payload
            }
        case 'CREATE_LABEL':
            return {
                labels: [action.payload, ...state.labels]
            }
        case 'DELETE_LABEL':
            return {
                labels: state.labels.filter(l => l._id !== action.payload._id)
            }
        case 'UPDATE_LABEL':  // New case for updating labels
            return {
                labels: state.labels.map(label => 
                    label._id === action.payload._id ? action.payload : label
                )
            }
        default:
            return state
    }
}

export const LabelContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(labelsReducer, {
        labels: null
    })

    return(
        <LabelContext.Provider value={({...state, dispatch})}>
            {children}
        </LabelContext.Provider>
    )
}