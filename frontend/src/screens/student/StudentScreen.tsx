import React, { useState } from 'react'
import AddStudent from './features/AddStudent'
import { Button } from '@/components/ui/Button'
import StudentsList from './features/StudentsList'
import AddMultipleStudent from './features/AddMultipleStudent'

const StudentScreen = () => {
  const [mode, setMode] = useState<'add' | 'manage' | 'add-multiple'>('add')

  return (
    <div className="flex flex-1 flex-col items-center justify-start py-8">
      <div className="flex gap-4 mb-8">
        
        <Button
        variant={mode === 'add' ? 'default' : 'outline'}
        onClick={() => setMode("add")}
        >
          Add Student
        </Button>
        <Button
        variant={mode === 'manage' ? 'default' : 'outline'}
        onClick={() => setMode("manage")}
        >
          Manage Student
        </Button>
        <Button
        variant={mode === 'add-multiple' ? 'default' : 'outline'}
        onClick={() => setMode("add-multiple")}
        >
          Add Multiple
        </Button>
        
      </div>
      <div className="w-full flex justify-center">
        {mode === 'add' && <AddStudent />}
        {mode === 'manage' && ( <StudentsList /> )}
        {mode === 'add-multiple' && ( <AddMultipleStudent />
        )}
      </div>
    </div>
  )
}

export default StudentScreen