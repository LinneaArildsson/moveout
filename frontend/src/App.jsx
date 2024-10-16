import './App.css';
import {React} from 'react';
import { HashRouter, Routes, Route, Navigate} from 'react-router-dom';

//hooks
import { useAuthContext } from './hooks/useAuthContext';

//components
import Navbar from '../src/components/Navbar';
import Home from '../src/pages/Home';
import Register from '../src/pages/Register';
import Login from '../src/pages/Login';

import LabelView from './components/LabelView';


function App() {
  const {user} = useAuthContext();

  return (
    <div className='App'>
      <HashRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
            <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />} />
            <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />

            {/* Public route for viewing labels */}
            <Route path='/labels/:id' element={<LabelView />} />
          </Routes>
        </div>
      </HashRouter>
    </div>

  );
}

export default App;
