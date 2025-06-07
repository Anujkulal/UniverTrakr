import React, { useState } from 'react'
import AddStudent from './features/AddStudent'
import { Button } from '@/components/ui/Button'

const StudentScreen = () => {
  const [mode, setMode] = useState<'add' | 'edit' | 'add-multiple'>('add')

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
        variant={mode === 'edit' ? 'default' : 'outline'}
        onClick={() => setMode("edit")}
        >
          Edit Student
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
        {mode === 'edit' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Edit Student (Coming Soon)</h2>
            {/* Implement edit student form here */}
          </div>
        )}
        {mode === 'add-multiple' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Add Multiple Students (Coming Soon)</h2>
            {/* Implement add multiple students form here */}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentScreen