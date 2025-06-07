import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import studentImg from "@/assets/iconImg/student.jpg"
import facultyImg from "@/assets/iconImg/faculty.jpg"
import adminImg from "@/assets/iconImg/admin.jpg"
import H2 from '@/components/ui/H2'
import { Button } from '@/components/ui/Button'
import { mainTitle } from '@/lib/mainTitle'

const roles = [
	{
		title: 'Student',
		description:
			'Access your courses, view grades, and manage your profile. Get started by signing in as a student.',
		image: studentImg,
		link: '/signin',
	},
	{
		title: 'Faculty',
		description:
			'Manage classes, upload materials, and interact with students. Sign in as faculty to begin.',
		image: facultyImg,
		link: '/signin',
	},
	{
		title: 'Admin',
		description:
			'Oversee the college system, manage users, and configure settings. Sign in as admin to continue.',
		image: adminImg,
		link: '/signin',
	},
]

const LandingScreen = () => {
	const navigate = useNavigate()

	useEffect(() => {}, [navigate])
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-12 px-4">
			<motion.h1
				className="text-4xl font-bold text-blue-800 mb-8 text-center"
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				Welcome to {mainTitle()}
			</motion.h1>
            
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
				{roles.map((role, idx) => (
					<motion.div
						key={role.title}
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow cursor-pointer"
						whileHover={{ scale: 1.04, y: -5 }}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
						onClick={() =>
							navigate(role.link, {
								state: { role: role.title.toLowerCase() },
							})
						}
					>
						<img
							src={role.image}
							alt={role.title}
							className="w-28 h-28 object-cover rounded-full mb-4 border-4 border-indigo-200"
						/>
                        <H2 className='text-blue-800'>
                            {role.title}
                        </H2>
						<p className="text-gray-600 text-center mb-4">
							{role.description}
						</p>
						
                        <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(role.link, {
                                state: { role: role.title.toLowerCase() },
                            })
                        }}
                        >
                            Get Started
                        </Button>
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default LandingScreen