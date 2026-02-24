import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import authService from '../../services/authService'
import { BrainCircuit, Mail, Lock, ArrowRight, User } from 'lucide-react'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const navigate = useNavigate()
 
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password.length < 6 ){
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('')
    setLoading(true)
    try {
      await authService.register(username, email, password)
      toast.success('Registered successfully!')
      navigate('/login')
    } catch (err) {
      setError(err?.message || err?.error || 'Failed to register')
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
            <h1 className='text-[24px] tracking-tight'>Create Account</h1>
            <p className='text-[16px] text-gray-500'>Join us to start your learning journey</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-[16px]'>
          {/*Username */}
          <div className='flex flex-col gap-[8px]'>
            <span className='text-[14px] text-gray-500'>USERNAME</span>
            <div className='flex items-center gap-[16px] border border-gray-300 rounded-[8px] p-2 group focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all ease-in-out duration-300'>
              <User className='w-6 h-6 text-gray-500 group-focus-within:text-emerald-500 transition-all ease-in-out duration-300' />
              <input
                type='text'
                id='username'
                aria-label='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder='johndoe'
                className='w-full outline-none bg-transparent'
              />
            </div>
          </div>
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
              className='flex flex-row gap-[8px] items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[12px] py-3 w-full group hover:from-teal-600 hover:to-emerald-600 transition-colors shadow-emerald-500/40 shadow-lg'
            >
              <p>{loading ? 'Creating... ' : 'Create Account'}</p>
              {loading ? <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' /> : <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />}
            </button>
          </div>
        </form>
        {/*Login Link */}
        <div className='bg-gray-200 w-full h-[1px]'></div>
        <div className='text-center'>
          <p className='text-[16px] text-gray-500 tracking-tight font-light'>Already have an account? <Link to='/login' className='text-emerald-500 hover:text-emerald-600 transition-colors'>Sign in</Link></p>
        </div>
      </div>
      <div className='text-center text-[14px] text-slate-500 tracking-tight font-light'>By continuing you agree to our Terms & Privacy Policy</div>
    </div>
  )
}

export default RegisterPage
