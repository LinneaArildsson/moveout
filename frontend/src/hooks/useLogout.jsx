import { useAuthContext } from './useAuthContext';
import {useLabelContext} from './useLabelsContext';


export const useLogout = () => {
    const {dispatch} = useAuthContext();
    const {dispatch: labelDispatch} = useLabelContext();

    const logout = () => {
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'});
        labelDispatch({type: 'SET_LABEL', payload: null});
    }

    return {logout};
}