import React, { useState } from 'react'
import CreateTimetable from './features/timetable/CreateTimetable'
import { Button } from '@/components/ui/Button';
import ManageTimetable from './features/timetable/ManageTimetable';
import ViewTimetable from './features/timetable/ViewTimetable';

const TimetableScreen = () => {
    const [mode, setMode] = useState<'create' | 'manage'>('create');
    const auth = JSON.parse(localStorage.getItem("user") || "{}");
    const role = auth?.role?.toLowerCase() || "";
    const branchCode = auth?.branchCode || "";
  
  return (
    <div className="flex flex-1 flex-col items-center justify-start py-8">
      <div className="flex gap-4 mb-8">
        
        {
          role === "student" ? (
            <></>
          ) : (
            <>
              <Button
              variant={mode === 'create' ? 'default' : 'outline'}
              onClick={() => setMode("create")}
              >
                Create Timetable
              </Button>
              <Button
              variant={mode === 'manage' ? 'default' : 'outline'}
              onClick={() => setMode("manage")}
              >
                Manage Timetable
              </Button>
            </>
          )
        }
        
      </div>
      <div className="w-full flex justify-center">
        {
          role === "student" ? (
            <>
              <ViewTimetable />
            </>
          ) : (
            <>
              {mode === 'create' && <CreateTimetable />}
              {mode === 'manage' && ( <ManageTimetable /> )}
            </>
          )
        }
      </div>
    </div>
  )
}

export default TimetableScreen