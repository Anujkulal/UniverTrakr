import Sidebar from '@/components/features/Sidebar'
import { Button } from '@/components/ui/Button'
import H2 from '@/components/ui/H2'
import  { useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'
// import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const ProfileScreen = () => {
    const navigate = useNavigate()

    const auth = JSON.parse(localStorage.getItem('user') || '{}')
    // console.log('User from localStorage:', auth)

    // Redirect if not authenticated
  useEffect(() => {
    // console.log("Checking window location:", window.location)
    if (!auth || !auth.userId) {
      if (window.location.pathname !== '/signin') {
        console.error('No user data found, redirecting to sign-in page.')
        navigate('/signin', { replace: true })
      }
    }
  }, [auth, navigate])

    // Dummy user data for UI demonstration
    const user = {
      name: 'John Doe',
      email: auth?.userId,
      role: auth?.role?.toLowerCase(),
      department: 'Computer Science',
      joined: '2023-08-15',
    }

    // Prevent rendering if not authenticated
  if (!auth || !auth.userId) return null

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar role={user.role} />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <FaUserCircle className="text-blue-500 mb-4" size={80} />
          <H2 className='text-blue-700'>{user.name}</H2>
          <p className="text-gray-600 mb-1">{user.email}</p>
          <span className="inline-block bg-indigo-100 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
            {user.role}
          </span>
          <div className="w-full border-t border-gray-200 my-4"></div>
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Department:</span>
              <span className="text-gray-600">{user.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Joined:</span>
              <span className="text-gray-600">{user.joined}</span>
            </div>
          </div>
     
          <Button>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileScreen