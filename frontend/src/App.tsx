import React from 'react'
import HomeScreen from './screens/HomeScreen'
import { Route, Routes } from 'react-router'
import Signin from './screens/Signin'

const App = () => {
  return (
    <div>
      <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/tutor' element={<Signin />} />
          <Route path='/admin' element={<Signin />} />
      </Routes>
    </div>
  )
}

export default App