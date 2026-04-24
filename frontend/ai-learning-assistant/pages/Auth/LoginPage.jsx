import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import { BrainCircuit, Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
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
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-sky-200 via-sky-100 to-white px-4'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -bottom-24 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-[100%] border border-white/40' />
        <div className='absolute bottom-8 left-1/2 h-72 w-[110%] -translate-x-1/2 rounded-[100%] border border-white/30' />
      </div>

      <div className='relative w-full max-w-sm rounded-3xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-sky-200/50 backdrop-blur-md'>
        <div className='mb-6 flex flex-col items-center gap-4'>
          <div className='rounded-2xl border border-white/60 bg-white p-3 shadow-md'>
            <LogIn className='h-5 w-5 text-emerald-600' />
          </div>
          <div className='text-center'>
            <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>Sign in with email</h1>
            <p className='mt-1 text-sm text-slate-500'>Continue your learning journey for free.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 group focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all duration-200'>
              <Mail className='h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors'/>
              <input
              type='email'
              id='email'
              aria-label='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder='you@email.com'
              className='w-full bg-transparent text-sm outline-none'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 group focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all duration-200'>
              <Lock className='h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors'/>
              <input
              type='password'
              id='password'
              aria-label='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full bg-transparent text-sm outline-none'
              />
            </div>
            <div className='flex justify-end'>
              <button type='button' className='text-xs text-slate-500 hover:text-emerald-600 transition-colors'>
                Forgot password?
              </button>
            </div>
          </div>
          {error && <div className='rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-center text-sm text-red-500'>{error}</div>}
          <div className='pt-1'>
            <button 
            type='submit' 
            disabled={loading} 
            className='group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/35 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700'
            >
              <p>{loading ? 'Signing in...' : 'Get Started'}</p>
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1'/>
              )}
            </button>
          </div>
        </form>

        <div className='my-5 h-px w-full bg-slate-200'></div>
        <div className='text-center text-sm text-slate-500'>
          Don&apos;t have an account?{' '}
          <Link to='/register' className='font-medium text-emerald-600 hover:text-emerald-700 transition-colors'>
            Sign up
          </Link>
        </div>
      </div>

      <div className='absolute left-4 top-4 flex items-center gap-2 text-sm font-medium text-slate-700'>
        <div className='rounded-md bg-emerald-600 p-1.5 text-white shadow-md shadow-emerald-500/30'>
          <BrainCircuit className='h-3.5 w-3.5' />
        </div>
        Lumina
      </div>
    </div>
  )
}

export default LoginPage
