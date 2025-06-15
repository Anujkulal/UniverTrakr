import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FaTimesCircle } from 'react-icons/fa'
import axios from 'axios'
import { baseUrl } from '@/lib/baseUrl'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux/store'
import { uploadMarks } from '@/redux/slices/marksSlice'

const backend_url = baseUrl();

interface UploadMarksProps {
  subject: string
  // subjects: { name: string; code: string }[]
  enrollmentNo?: string
  onClose: (updated?: boolean) => void
  fetchStudents: () => void
  setMessage: (msg: { type: 'success' | 'error'; text: string }) => void
}

// interface BranchProps {
//     name: string;
//     code: string;
// }

const UploadMarks: React.FC<UploadMarksProps> = ({
  fetchStudents,
  subject,
  enrollmentNo,
  onClose,
  setMessage,
}) => {
  const [form, setForm] = useState({
    enrollmentNo: enrollmentNo || '',
    branch: '',
    semester: '',
    subject: subject || '',
    internal: {
      internal1: '',
      internal2: '',
    },
    internalAvg: '',
    assignment: '',
    totalInternal: '',
    external: '',
    totalMarks: '',
  })

  // Calculate derived values
  const internal1 = parseFloat(form.internal.internal1) || 0
  const internal2 = parseFloat(form.internal.internal2) || 0
  const assignment = parseFloat(form.assignment) || 0
  const external = parseFloat(form.external) || 0
  const internalAvg = (internal1 + internal2) / 2
  const totalInternal = Math.round(internalAvg + assignment)
  const totalMarks = Math.round(internalAvg + assignment + external)

  const dispatch = useDispatch<AppDispatch>();
  // const [branches, setBranches] = useState<BranchProps[]>([]);
  // const { loading, error, success } = useSelector((state: RootState) => state.marks);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ 
      ...form, 
      internal: {
        ...form.internal,
        [e.target.name]: e.target.value 
      },
      [e.target.name]: e.target.value 
    })
  }

  const fetchMarks = async () => {
    try {
      const response = await axios.get(`${backend_url}/faculty/marks/${form.enrollmentNo}/${subject}`, { withCredentials: true });
      console.log('Fetched marks response:', response.data.marks);
      const marksData = response.data.marks;
      if (marksData) {
        setForm({
          ...form,
          internal:{
            internal1: marksData.internal.internal1 || '',
            internal2: marksData.internal.internal2 || '',
          },
          assignment: marksData.assignment || '',
          external: marksData.external || '',
          internalAvg: marksData.internalAvg || '',
          totalInternal: marksData.totalInternal || '',
          totalMarks: marksData.totalMarks || '',
        })
      }
      // setMessage({ type: 'success', text: 'Marks fetched successfully' })
      // console.log('Fetched marks:', marksData)
    } catch (error) {
      console.error('Error fetching marks:', error)
      setMessage({ type: 'error', text: 'Failed to fetch marks' })
      
    }
  }
  useEffect(() => {
    if (enrollmentNo && subject) {
      fetchMarks();
    }
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // You may want to validate here
    // Handle form submission logic here
    // alert(`Branch: ${form.branch}\nSemester: ${form.semester}\nSubject: ${form.subject}`)
    
    dispatch(uploadMarks({form, internalAvg, totalInternal, totalMarks}));
    // console.log('Form submitted:', {
    //   ...form,
    //   internalAvg,
    //   totalInternal,
    //   totalMarks,
    // })
    setMessage({ type: 'success', text: 'Marks uploaded successfully!' })
    // fetchStudents()
    onClose(true)
  }

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <Button
        type='button'
        onClick={() => onClose()}
        variant={"plain"}
        className=""
      >
        <FaTimesCircle size={20} />
      </Button>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Upload Marks</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 justify-between">
          <Input
            type="text"
            name="enrollmentNo"
            label='Enrollment No'
            placeholder="Enrollment No"
            value={enrollmentNo}
            disabled
            className='bg-gray-100 cursor-not-allowed'
          />
          <Input
            type="text"
            name="subject"
            label='Subject'
            placeholder="subject"
            value={subject}
            disabled
            className='bg-gray-100 cursor-not-allowed'
          />
          <Input
            type="number"
            name="internal1"
            label='Internal 1'
            placeholder="Internal 1"
            min={0}
            max={25}
            value={form.internal.internal1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-4 justify-between">
          <Input
            type="number"
            name="internal2"
            label='Internal 2'
            placeholder="Internal 2"
            min={0}
            max={25}
            value={form.internal.internal2}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="internalAvg"
            label='Internal Average'
            placeholder="Internal Average"
            value={internalAvg || ''}
            // onChange={handleChange}
            disabled
            className='bg-gray-100 cursor-not-allowed'
          />
          <Input
            type="number"
            name="assignment"
            label='Assignment Marks'
            placeholder="Assignment Marks"
            min={0}
            max={25}
            value={form.assignment}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-4 justify-between">
          <Input
            type="number"
            name="totalInternal"
            label='Total Internal Marks'
            placeholder="Total Internal Marks"
            value={totalInternal || ''}
            // onChange={handleChange}
            disabled
            className='bg-gray-100 cursor-not-allowed'
          />
          <Input
            type="number"
            name="external"
            label='External Marks'
            placeholder="External Marks"
            min={0}
            max={50}
            value={form.external}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="totalMarks"
            label={`Total Marks: ${totalMarks}/100`}
            placeholder="Total Marks"
            value={totalMarks || ''}
            // onChange={handleChange}
            disabled
            className='bg-gray-100 cursor-not-allowed'
          />
        </div>

        <Button type="submit" className="w-full">
          Upload
        </Button>
      </form>
    </div>
  )
}

export default UploadMarks