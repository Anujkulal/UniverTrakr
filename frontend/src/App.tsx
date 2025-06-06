import React from 'react'
import HomeScreen from './screens/HomeScreen'
import { Route, Routes } from 'react-router'
import Signin from './screens/Signin'
import Sidebar from './components/features/Sidebar'
import ProfileScreen from './screens/ProfileScreen'

const App = () => {
  return (
    <div>
      <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/admin'>
            <Route index path='profile' element={<ProfileScreen />} />
          </Route>
          <Route path='/faculty'>
            <Route index path='profile' element={<ProfileScreen />} />
          </Route>
          <Route path='/student'>
            <Route index path='profile' element={<ProfileScreen />} />
          </Route>
      </Routes>
    </div>
  )
}

export default App