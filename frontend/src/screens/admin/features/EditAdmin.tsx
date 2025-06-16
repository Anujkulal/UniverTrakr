import { Button } from '@/components/ui/Button'
import H2 from '@/components/ui/H2'
import { Input } from '@/components/ui/Input'
import { baseUrl } from '@/lib/baseUrl'
import { clearAdminState, editAdminDetails } from '@/redux/slices/adminSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import React, { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

const backend_url = baseUrl();

interface EditAdminProps {
  admin: any
  onClose: (updated?: boolean) => void
  fetchAdmins: () => void
  setMessage: (msg: { type: 'success' | 'error'; text: string }) => void
}

const EditAdmin: React.FC<EditAdminProps> = ({admin, onClose, setMessage, fetchAdmins}) => {
  const dispatch = useDispatch<AppDispatch>()
    const [form, setForm] = useState({ ...admin })
    const [preview, setPreview] = useState<string | null>(null)
    // const [loading, setLoading] = useState(false)
    const {loading } = useSelector((state: RootState) => state.admin)
    // console.log('Admin from props:', admin)
    // console.log('Form state:', form)
  
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
  
      dispatch(editAdminDetails({ formData, adminId: form.adminId }))
      .unwrap()
      .then((res) => {
        setMessage({type: "success", text: res.message || "Admin details updated successfully"});
        setForm({...form }) // Reset form
        fetchAdmins(); // Fetch updated admin list
        setPreview(null);
        dispatch(clearAdminState()); // Clear state after submission
        onClose(true);
      })
      .catch((err) => {
      setMessage({ type: 'error', text: err || 'Failed to update admin' });
    });
    }
    console.log("Form user gender: ", form.gender)
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
         <H2 className='text-blue-700'>Edit Admin</H2>
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
             name="adminId"
             placeholder="Admin ID"
             value={form.adminId}
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
             name="gender"
             value={form.gender}
             onChange={handleChange}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
             required
           >
             <option value="">Gender</option>
             <option value="male">Male</option>
             <option value="female">Female</option>
             <option value="other">Other</option>
           </select>
         </div>
         <div className="flex gap-4">
   
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
               src={preview ? preview : `${backend_url.replace("/api", "")}/media/admin/${form.profile}?v=${admin.updatedAt || Date.now()}`}
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

export default EditAdmin