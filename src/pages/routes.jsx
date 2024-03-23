import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './main'
import BlockedPage from './blocked'


const PageRoutes = () => {
  return (
    <>
      {/* <BrowserRouter> */}
        <Routes>
          <Route path='/' element={<Main/>} />
          <Route path='blocked' element={<BlockedPage/>} />
        </Routes>
      {/* </BrowserRouter> */}
    </>
  )
}

export default PageRoutes