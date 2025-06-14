import { Button } from '@/components/ui/Button'
import React, { useState } from 'react'
import AddFaculty from './features/AddFaculty'
import FacultiesList from './features/FacultiesList'
import AddMultipleFaculty from './features/AddMultipleFaculty'

const FacultyScreen = () => {
    const [mode, setMode] = useState<'add' | 'manage' | 'add-multiple'>('add')
  
  return (
    <div className="flex flex-1 flex-col items-center justify-start py-8">
      <div className="flex gap-4 mb-8">
        
        <Button
        variant={mode === 'add' ? 'default' : 'outline'}
        onClick={() => setMode("add")}
        >
          Add Faculty
        </Button>
        <Button
        variant={mode === 'manage' ? 'default' : 'outline'}
        onClick={() => setMode("manage")}
        >
          Manage Faculty
        </Button>
        <Button
        variant={mode === 'add-multiple' ? 'default' : 'outline'}
        onClick={() => setMode("add-multiple")}
        >
          Add Multiple
        </Button>
        
      </div>
      <div className="w-full flex justify-center">
        {mode === 'add' && <AddFaculty />}
        {mode === 'manage' && ( <FacultiesList /> )}
        {mode === 'add-multiple' && ( <AddMultipleFaculty />
        )}
      </div>
    </div>
  )
}

export default FacultyScreen