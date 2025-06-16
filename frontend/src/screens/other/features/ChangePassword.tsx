import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { baseUrl } from '@/lib/baseUrl'
import axios from 'axios'
import H2 from '@/components/ui/H2'
import { FaTimesCircle } from 'react-icons/fa'

interface ChangePasswordProps {
    user: any;
  onClose: () => void
  setMessage: (msg: { type: 'success' | 'error'; text: string }) => void
}

const backend_url = baseUrl()

const ChangePassword: React.FC<ChangePasswordProps> = ({ user, onClose, setMessage }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
        if(confirmNewPassword !== newPassword){
            setMessage({ type: 'error', text: 'Confirm your password!' })
            setLoading(false)
            return;
        }
      const res = await axios.put(
        `${backend_url}/${user.role}/me/password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      )
      setMessage({ type: 'success', text: res.data.message || 'Password changed successfully' })
      setLoading(false)
      onClose()
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password'
      })
      setLoading(false)
    }
  }

  return (
      <form
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-5 relative"
        onSubmit={handleSubmit}
      >
        
        <Button
              type='button'
                onClick={onClose}
              variant={"plain"}
              className='hover:text-red-600'>
                <FaTimesCircle size={20} />
              </Button>
        <H2 className='text-blue-700'>Change Password</H2>
        <Input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm Password"
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
  )
}

export default ChangePassword