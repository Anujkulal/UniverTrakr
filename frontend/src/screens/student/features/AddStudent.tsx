import { Button } from '@/components/ui/Button'
import H2 from '@/components/ui/H2'
import { Input } from '@/components/ui/Input'
import React, { useState } from 'react'

const initialState = {
  firstname: '',
  middlename: '',
  lastname: '',
  usn: '',
  email: '',
  phno: '',
  semester: '',
  branch: '',
  gender: '',
  profileImage: null as File | null,
}

const AddStudent = () => {
  const [form, setForm] = useState(initialState)
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any
    if (name === 'profileImage' && files && files[0]) {
      setForm({ ...form, profileImage: files[0] })
      setPreview(URL.createObjectURL(files[0]))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit form data to backend
    alert('Student added!\n' + JSON.stringify(form, null, 2))
    // Reset form
    setForm(initialState)
    setPreview(null)
  }

  return (
    // <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg space-y-5"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <H2 className='text-blue-700'>Add Student</H2>
        <div className="flex gap-4">
          {/* <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          /> */}
          <Input
          type='text'
          name='firstname'
          placeholder='First Name'
          value={form.firstname}
          onChange={handleChange}
          required
          />
          {/* <input
            type="text"
            name="middlename"
            placeholder="Middle Name"
            value={form.middlename}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          /> */}
          <Input
          type='text'
          name='middlename'
          placeholder='Middle Name'
          value={form.middlename}
          onChange={handleChange}
          required={false}
          />
          {/* <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          /> */}
          <Input 
          type='text'
          name='lastname'
          placeholder='Last Name'
          value={form.lastname}
          onChange={handleChange}
          required
          />
        </div>
        <div className="flex gap-4">
          {/* <input
            type="text"
            name="usn"
            placeholder="USN"
            value={form.usn}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          /> */}
          <Input
            type="text"
            name="usn"
            placeholder="USN"
            value={form.usn}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          {/* <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          /> */}
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div className="flex gap-4">
          {/* <input
            type="tel"
            name="phno"
            placeholder="Phone Number"
            value={form.phno}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          /> */}
          <Input
            type="tel"
            name="phno"
            placeholder="Phone Number"
            value={form.phno}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={form.branch}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-2 font-medium text-gray-700">Profile Image</label>
          {/* <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="mb-2"
          /> */}
          <Input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="mb-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 object-cover rounded-full border-2 border-indigo-400"
            />
          )}
        </div>
       
        <Button
          className='w-full'
        type='submit'
        >
          Add Student
        </Button>
      </form>
    // </div>
  )
}

export default AddStudent