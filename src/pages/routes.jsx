import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './main'
import BlockedPage from './blocked'


const PageRoutes = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main/>} />
        <Route path='/blocked' element={<BlockedPage/>} />
      </Routes>
    </>
  )
}

export default PageRoutes