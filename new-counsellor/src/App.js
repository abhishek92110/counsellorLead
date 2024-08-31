import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Counsellor from './CounsellorPanel'
import Admin from './AdminPanel'
import DataState from './context/DataState'
import LoginPanel from './LoginPanel'

// import Navbaar from './components/Navbaar';
export default function App() {
  return (
      <BrowserRouter>
    <DataState>
         <Routes>
         <Route exact path='/admin' element={<Admin />} />
         <Route exact path='/' element={<LoginPanel />} />
         <Route exact path='/counsellor' element={<Counsellor />} />
         </Routes>
         </DataState>
      </BrowserRouter>    
  )
}
