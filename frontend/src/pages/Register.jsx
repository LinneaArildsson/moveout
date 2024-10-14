import {React, useState} from 'react';
import {useRegister} from '../hooks/useRegister';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {register, error, isLoading} = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{

      await register(email, name, password);

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form className="register" onSubmit={handleSubmit}>
      <h3>Register New User</h3>
      
      <label>Name:</label>
      <input 
        type="name" 
        onChange={(e) => setName(e.target.value)} 
        value={name} 
      />
      <label>Email:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      />
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      />

      <button disabled={isLoading}>Register</button>
      {error && <div className='error'>{error}</div>}
    </form>
  )
}