import { Button } from '@/components/ui/Button';
import React, { useState } from 'react'
import AddAdmin from './features/AddAdmin';
import AdminList from './features/AdminList';

const AdminScreen = () => {
      const [mode, setMode] = useState<'add' | 'manage'>('add');
  
  return (
    <div className="flex flex-1 flex-col items-center justify-start py-8">
      <div className="flex gap-4 mb-8">
        
        <Button
        variant={mode === 'add' ? 'default' : 'outline'}
        onClick={() => setMode("add")}
        >
          Add Admin
        </Button>
        <Button
        variant={mode === 'manage' ? 'default' : 'outline'}
        onClick={() => setMode("manage")}
        >
          Manage Admin
        </Button>
        
      </div>
      <div className="w-full flex justify-center">
        {mode === 'add' && <AddAdmin />}
        {mode === 'manage' && ( <AdminList /> )}
      </div>
    </div>
  )
}

export default AdminScreen