import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('anuj@gmail.com')
  const [password, setPassword] = useState('Test@123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);    
    try{
      const {token, user} = await authService.login(email, password);
      login(user, token);
      toast.success('Logged in succesfully!');
      navigate('/dashboard');
    }catch(error){
      setError(error.message || 'Failed to login please check your credentials');
      toast.error(error.message || 'Failed to login');
    }finally{
      setLoading(false); 
    }
  }


  return (
    <div className=''>
      <div className=''/>
      
      <div className=''></div>
      <div className=''>
        {/*Header*/}
      </div>
      
    </div>
  )
}

export default LoginPage
