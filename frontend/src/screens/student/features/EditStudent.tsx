import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { baseUrl } from '@/lib/baseUrl'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { editStudentDetails, clearStudentState } from '@/redux/slices/studentSlice';
import { Input } from '@/components/ui/Input';
import H2 from '@/components/ui/H2';
import { FaTimesCircle } from "react-icons/fa";
import axios from 'axios';


const backend_url = baseUrl();

interface EditStudentProps {
  student: any
  onClose: (updated?: boolean) => void
  fetchStudents: () => void
  setMessage: (msg: { type: 'success' | 'error'; text: string }) => void
}

interface BranchProps {
    name: string;
    code: string;
}

const EditStudent: React.FC<EditStudentProps> = ({ student, onClose, fetchStudents, setMessage }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [form, setForm] = useState({ ...student })
  const [preview, setPreview] = useState<string | null>(null)
  // const [loading, setLoading] = useState(false)
  const {loading } = useSelector((state: RootState) => state.student)
  const [branches, setBranches] = useState<BranchProps[]>([])

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  // console.log('User from localStorage:', auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any
    if (name === 'profile' && files && files[0]) {
      setForm({ ...form, profile: files[0] })
      setPreview(URL.createObjectURL(files[0]))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // console.log("Submitting Form Data: ", form)

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if(value !== null){
        formData.append(key, value as string);
      }
    });

    dispatch(editStudentDetails({ formData, role: auth.role.toLowerCase(), enrollmentNo: form.enrollmentNo }))
    .unwrap()
    .then((res) => {
      setMessage({type: "success", text: res.message || "Student details updated successfully"});
      setForm({...form }) // Reset form
      fetchStudents(); // Fetch updated students list
      setPreview(null);
      dispatch(clearStudentState()); // Clear state after submission
      onClose(true);
    })
    .catch((err) => {
    setMessage({ type: 'error', text: err || 'Failed to update student' });
  });
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
      <Button
      type='button'
        onClick={() => onClose()}
      variant={"plain"}>
        <FaTimesCircle size={20} />
      </Button>
      <H2 className='text-blue-700'>Edit Student</H2>
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
          disabled
          className='bg-gray-200 cursor-not-allowed'
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled
          className='bg-gray-200 cursor-not-allowed'
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          required
        >
          <option value="">Branch</option>
          {
            branches.map((branch) => (
              <option key={branch.code} value={branch.code}>
                {branch.name} ({branch.code})
              </option>
            ))
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
        {(preview || form.profile) && (
          <img
            src={preview ? preview : `${backend_url.replace("/api", "")}/media/student/${form.profile}?v=${student.updatedAt || Date.now()}`}
            // Force the image to reload by appending a cache-busting query string (e.g., a timestamp or Date.now()) to the image URL.

            alt="Profile Preview"
            className="w-24 h-24 object-cover rounded-full border-2 border-indigo-400"
          />
        )}
      </div>
      <Button
        className='w-full'
        type='submit'
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}

export default EditStudent