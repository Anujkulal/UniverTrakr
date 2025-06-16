import React, { useState } from 'react'
import axios from 'axios'
import { baseUrl } from '@/lib/baseUrl'
import { Button } from '@/components/ui/Button'
import MessageBar from '@/components/ui/MessageBar'
import { Input } from '@/components/ui/Input'
import H2 from '@/components/ui/H2'

const backend_url = baseUrl()

const NotifyAll = () => {
  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await axios.post(
        `${backend_url}/admin/notice`, {...form, role: "All"}, { withCredentials: true }
      )
      setMessage({ type: 'success', text: res.data.message || 'Notification sent to all users!' })
      setForm({ title: '', description: '' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to notify all users' })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      {message && (
        <MessageBar
          variant={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      <H2 className="text-blue-700">Notify All Users</H2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-2xl"
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Notifying...' : 'Notify All'}
        </Button>
      </form>
    </div>
  )
}

export default NotifyAll