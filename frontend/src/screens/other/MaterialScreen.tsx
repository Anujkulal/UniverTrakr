import { Button } from '@/components/ui/Button';
import React, { useState } from 'react'
import AddMaterial from './features/material/AddMaterial';
import ViewMaterial from './features/material/ViewMaterial';

const MaterialScreen = () => {
      const [mode, setMode] = useState<'add' | 'view'>('add');
      const auth = JSON.parse(localStorage.getItem("user") || "{}");
      const role = auth?.role?.toLowerCase() || "";
    
  return (
    <div className="flex flex-1 flex-col items-center justify-start py-8">
      <div className="flex gap-4 mb-8">
        {
          role !== "student" && (
            <>
              <Button
              variant={mode === 'add' ? 'default' : 'outline'}
              onClick={() => setMode("add")}
              >
                Add material
              </Button>
              <Button
              variant={mode === 'view' ? 'default' : 'outline'}
              onClick={() => setMode("view")}
              >
                View materials
              </Button>
            
            </>
          )
        }
        
      </div>
      <div className="w-full flex justify-center">
        {
          role === "student" ? (
          <>
            <ViewMaterial />
          </>
          ) : (
          <>
            {mode === 'add' && <AddMaterial />}
            {mode === 'view' && ( <ViewMaterial /> )}
          </>)
        }
      </div>
    </div>
  )
}

export default MaterialScreen