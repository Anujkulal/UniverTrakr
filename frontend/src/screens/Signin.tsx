import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import H2 from '@/components/ui/H2'
import { Input } from '@/components/ui/Input'

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Faculty', value: 'faculty' },
  { label: 'Student', value: 'student' },
]

const Signin = () => {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    setError('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy validation
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    // TODO: Add actual signin logic here
    alert(`Signing in as ${role} with email: ${email}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
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
            type="email"
            label = "Email"
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
            label = "Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete='current-password'
            required
            />
          </div>
          {error && (
            <motion.div
              className="mb-4 text-red-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
          <Button
          type='submit'
          className='w-full mt-2'
          >
            Sign In as {roles.find(r => r.value === role)?.label}
          </Button>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default Signin