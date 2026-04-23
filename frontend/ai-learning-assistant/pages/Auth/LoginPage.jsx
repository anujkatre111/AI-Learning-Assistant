import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    }finally{
      setLoading(false); 
    }
  }


  return (
    <div className='flex flex-col gap-[48px] justify-center items-center h-screen'>
      <div className='flex flex-col gap-[24px] shadow-md rounded-[16px] px-8 py-10 w-[400px] border border-gray-100'>
        <div className='flex flex-col items-center justify-center gap-[16px]'>
          <div className='icon bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[16px] p-3 w-fit shadow-emerald-500/40 shadow-lg'>
            <BrainCircuit className='w-10 h-10 text-white' />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-[24px] tracking-tight'>Welcome Back!</h1>
            <p className='text-[16px] text-gray-500'>Sign in to continue your journey</p>
          </div>
        </div>
        {/*Form */}
        <div className='flex flex-col gap-[16px]'>
          {/*Email */}
          <div className='flex flex-col gap-[8px]'>
            
            <span className='text-[14px] text-gray-500'>EMAIL</span>
            <div className='flex items-center gap-[16px] border border-gray-300 rounded-[8px] p-2 group focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all ease-in-out duration-300'>
              <Mail className='w-6 h-6 text-gray-500 group-focus-within:text-emerald-500 transition-all ease-in-out duration-300'/>
              <input
              type='email'
              id='email'
              aria-label='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder='you@email.com'
              className='w-full outline-none bg-transparent'
              />
            </div>
          </div>
          {/*Password */}
          <div className='flex flex-col gap-[8px] text-[16px]'>
            
            <span className='text-[14px] text-gray-500'>PASSWORD</span>
            <div className='flex items-center gap-[16px] border border-gray-300 rounded-[8px] p-2 group focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all ease-in-out duration-300'>
              <Lock className='w-6 h-6 text-gray-500 group-focus-within:text-emerald-500 transition-all ease-in-out duration-300'/>
              <input
              type='password'
              id='password'
              aria-label='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='..........'
              className='w-full outline-none bg-transparent'
              />
            </div>
          </div>
          {error && <div className='bg-red-500/10 border border-red-500/20 text-red-500 text-[14px] text-center p-2 rounded-[8px]'>{error}</div>}
          {/*Submit Button */}
          <div className='flex items-center justify-center text-white text-[16px] font-light'>
            <button 
            type='submit' 
            disabled={loading} 
            onClick={handleSubmit}
            className='flex flex-row gap-[8px] items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[12px] py-3  w-full group hover:from-teal-600 hover:to-emerald-600 transition-colors shadow-emerald-500/40 shadow-lg'><p>{loading ? 'Signing in....' : 'Sign in'}</p> {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform'/>}</button>
          </div>
        </div>
        {/*Register Link */}
        <div className='bg-gray-200 w-full h-[1px]'></div>
        <div className='text-center'>
          <p className='text-[16px] text-gray-500 tracking-tight font-light'>Don't have an account?<span> <Link to='/register' className='text-emerald-500 hover:text-emerald-600 transition-colors'>Sign up</Link></span></p>
        </div>
      </div>
      <div className='text-center text-[14px] text-slate-500 tracking-tight font-light'>By continuing you agree to our Terms & Privacy Policy</div>
    </div>
  )
}

export default LoginPage
