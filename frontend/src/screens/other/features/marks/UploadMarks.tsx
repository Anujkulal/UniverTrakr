import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FaTimesCircle } from 'react-icons/fa'

interface UploadMarksProps {
  subjects: string
  enrollmentNo?: string
  onClose: (updated?: boolean) => void
  fetchStudents: () => void
  setMessage: (msg: { type: 'success' | 'error'; text: string }) => void
}

// interface BranchProps {
//     name: string;
//     code: string;
// }

const UploadMarks: React.FC <UploadMarksProps> = ({fetchStudents, subjects, enrollmentNo, onClose, setMessage}) => {
  const [form, setForm] = useState({
    enrollmentNo: enrollmentNo || '',
    branch: '',
    semester: '',
    subject: '',
    internal1: '',
    internal2: '',
    internalAvg: '',
    assignment: '',
    totalInternal: '',
    external: '',
    totalMarks: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    alert(`Branch: ${form.branch}\nSemester: ${form.semester}\nSubject: ${form.subject}`)
  }

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <Button
            type='button'
              onClick={() => onClose()}
            variant={"plain"}>
              <FaTimesCircle size={20} />
            </Button>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Upload Marks</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="branch"
          placeholder="Branch"
          value={branchCode}
          onChange={handleChange}
          disabled
          className='bg-gray-100 cursor-not-allowed'
        />
        {/* <Input
          type="text"
          name="semester"
          placeholder="Semester"
          value={form.semester}
          onChange={handleChange}
          required
        /> */}
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
        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </div>
  )
}

export default UploadMarks