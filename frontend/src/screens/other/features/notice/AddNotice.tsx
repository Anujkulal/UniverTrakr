import { Button } from '@/components/ui/Button'
import H2 from '@/components/ui/H2'
import { Input } from '@/components/ui/Input'
import MessageBar from '@/components/ui/MessageBar'
import { baseUrl } from '@/lib/baseUrl'
import axios from 'axios'
import React, { useState } from 'react'

const backend_url = baseUrl()

const AddNotice = () => {
    const [form, setForm] = useState({
    title: '',
    description: '',
    link: '',
    branch: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const auth = JSON.parse(localStorage.getItem('user') || '{}')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await axios.post(`${backend_url}/${auth.role.toLowerCase()}/notice`, {...form, role: "Student"}, { withCredentials: true })
      setMessage({ type: 'success', text: res.data.message || 'Notice Added Successfully' })
      setForm({ title: '', description: '', link: '', branch: '' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add notice' })
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-1 items-start mt-10 justify-center">
        <div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg'>

      {message && (
        <MessageBar
          variant={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      <H2 className='text-blue-700'>Add Notice to students</H2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
        type='text'
        name='title'
        placeholder='Title'
        value={form.title}
        onChange={handleChange}
        required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <Input
          type="text"
          name="link"
          placeholder="Link"
          value={form.link}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="branch"
          placeholder="Branch"
          value={form.branch}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Adding...' : 'Add Notice'}
        </Button>
      </form>
       </div>
    </div>
  )
}

export default AddNotice