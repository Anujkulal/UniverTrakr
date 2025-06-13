import React, { useState } from 'react'
import axios from 'axios'
import { baseUrl } from '@/lib/baseUrl'
import { Button } from '@/components/ui/Button'
import MessageBar from '@/components/ui/MessageBar'
import H2 from '@/components/ui/H2'
import { Input } from '@/components/ui/Input'
import AddNotice from './features/notice/AddNotice'
import NotifyAll from './features/notice/NotifyAll'
import NotifyFaculty from './features/notice/NotifyFaculty'
import { MdNotificationsActive } from "react-icons/md";
import ViewNotice from './features/notice/ViewNotice'

const NoticeScreen = () => {
      const [mode, setMode] = useState<'all' | 'add' | 'faculty' | 'view'>('all');

  return (
    <div className="flex flex-1 flex-col items-center justify-start py-8">
      <div className="flex gap-4 mb-8">
        
        <Button
        variant={mode === 'all' ? 'default' : 'outline'}
        onClick={() => setMode("all")}
        >
          Notify All
        </Button>
        <Button
        variant={mode === 'add' ? 'default' : 'outline'}
        onClick={() => setMode("add")}
        >
          Add Notice
        </Button>
        <Button
        variant={mode === 'faculty' ? 'default' : 'outline'}
        onClick={() => setMode("faculty")}
        >
          Notify Faculty
        </Button>
        <Button
        variant={mode === 'view' ? 'default' : 'outline'}
        className='bg-orange-400 hover:text-orange-500'
        onClick={() => setMode("view")}
        >
          <MdNotificationsActive size={20} className='hover:scale-110' />
        </Button>
        
      </div>
      <div className="w-full flex justify-center">
        {mode === 'all' && <NotifyAll />}
        {mode === 'add' && <AddNotice />}
        {mode === 'faculty' && <NotifyFaculty />}
        {mode === 'view' && <ViewNotice />}
      </div>
    </div>
  )
}

export default NoticeScreen