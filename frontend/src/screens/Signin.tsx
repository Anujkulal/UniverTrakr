import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import H2 from '@/components/ui/H2'
import { Input } from '@/components/ui/Input'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/redux/slices/authSlice'
import type { RootState, AppDispatch } from '@/redux/store'
import ErrorBar from '@/components/ui/ErrorBar'

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Faculty', value: 'faculty' },
  { label: 'Student', value: 'student' },
]

const Signin = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)

  // Use role from location.state if present, else default to 'admin'
  const [role, setRole] = useState(() => {
    const stateRole = location.state?.role
    return roles.some(r => r.value === stateRole) ? stateRole : 'admin'
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (location.state?.role && roles.some(r => r.value === location.state.role)) {
      setRole(location.state.role)
    }
  }, [location.state])

  useEffect(() => {
    if (auth.error) setError(auth.error)
    else setError('')
    if (auth.user) {
      // Redirect to dashboard or home after successful login
      navigate('/')
    }
  }, [auth, navigate])

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    setError('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    dispatch(login({ email, password, role }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <H2 className='text-blue-700'>Sign In</H2>
        <div className="flex justify-center mb-6 space-x-4">
          {roles.map((r) => (
            <Button
              type='button'
              key={r.value}
              onClick={() => handleRoleChange(r.value)}
              variant={role === r.value ? 'default' : 'outline'}
            >
              {r.label}
            </Button>
          ))}
        </div>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mb-4">
            <Input
              id='email'
              name='email'
              type="text"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4">
            <Input 
              id='password'
              name='password'
              type='password'
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete='current-password'
              required
            />
          </div>
          {error && (
            // <motion.div
            //   // className="mb-4 text-red-600 text-sm"
            //   initial={{ opacity: 0 }}
            //   animate={{ opacity: 1 }}
            // >
              // {/* {error} */}
              <ErrorBar message={error} onClose={() => setError("")} />
            // </motion.div>
          )}
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={auth.loading}
          >
            {auth.loading ? 'Signing In...' : `Sign In as ${roles.find(r => r.value === role)?.label}`}
          </Button>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default Signin