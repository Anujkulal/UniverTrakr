import { Button } from '@/components/ui/Button'
import H2 from '@/components/ui/H2'
import { Input } from '@/components/ui/Input'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addStudentDetails, clearStudentState } from '@/redux/slices/studentSlice'
import type { RootState, AppDispatch } from '@/redux/store'
import MessageBar from '@/components/ui/MessageBar'
import axios from 'axios'
import { baseUrl } from '@/lib/baseUrl'

const backend_url = baseUrl();

const initialState = {
  firstName: '',
  middleName: '',
  lastName: '',
  enrollmentNo: '',
  email: '',
  phoneNumber: '',
  semester: '',
  branch: '',
  gender: '',
  profile: null as File | null,
}

interface BranchProps {
    name: string;
    code: string;
}

const AddStudent = () => {
  const [form, setForm] = useState(initialState)
  const [preview, setPreview] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const [branches, setBranches] = useState<BranchProps[]>([])
  const { loading, error, success } = useSelector((state: RootState) => state.student)

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";
  // console.log('User from localStorage:', auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any
    if (name === 'profile' && files && files[0]) {
      setForm({ ...form, profile: files[0] })
      setPreview(URL.createObjectURL(files[0]))
      // console.log("Profile Image: ", files[0])
      // console.log("Preview URL: ", URL.createObjectURL(files[0]))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    console.log("Submitting Form Data: ", formData)
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any)
    })

    // console.log("Form: ", form)
    // console.log('Form Data:', formData)

    dispatch(addStudentDetails({formData, role: auth.role.toLowerCase()}))
    setForm(initialState)
    setPreview(null)
  }

    const fetchBranch = async () => {
        try {
            const response = await axios.get(`${backend_url}/${auth.role.toLowerCase()}/branch`, { withCredentials: true})
            setBranches(response.data.branch || [])
            console.log('Fetched branches:', response.data.branch)
        } catch (err) {
            console.error('Failed to fetch branch:', err)
        }
    }

    useEffect(() => {
        if(auth && auth.role)
            fetchBranch();
    }, [])

  return (
    <form
      className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg space-y-5"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <H2 className='text-blue-700'>Add Student</H2>
      <MessageBar variant={error ? "error" : success ? "success" : "default"} message={error || success || ''} onClose={() => dispatch(clearStudentState())} />
      <div className="flex gap-4">
        <Input
          type='text'
          name='firstName'
          placeholder='First Name'
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <Input
          type='text'
          name='middleName'
          placeholder='Middle Name'
          value={form.middleName}
          onChange={handleChange}
        />
        <Input 
          type='text'
          name='lastName'
          placeholder='Last Name'
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-4">
        <Input
          type="text"
          name="enrollmentNo"
          placeholder="Enrollment No"
          value={form.enrollmentNo}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-4">
        <Input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
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
        
        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Branch</option>
          {
            role === "faculty" ? (
              <option value={branchCode}>{branchCode}</option>
            ) : (
                branches.map((branch) => (
                  <option key={branch.code} value={branch.code}>
                    {branch.name} ({branch.code})
                  </option>
                ))
                      
            )
          }
        </select>

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
        <Input
          type="file"
          name="profile"
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
        disabled={loading || !form.firstName || !form.lastName || !form.enrollmentNo || !form.email || !form.branch || !form.semester}
      >
        {loading ? 'Adding...' : 'Add Student'}
      </Button>
    </form>
  )
}

export default AddStudent