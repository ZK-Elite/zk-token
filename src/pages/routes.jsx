import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './main'
import BlockedPage from './blocked'
import Dapp from './dapp'


const PageRoutes = () => {
  return (
    <>
      {/* <BrowserRouter> */}
        <Routes>
          <Route path="/">
            <Route index element={<Dapp />} />
            <Route path="blocked" element={<BlockedPage />} />
          </Route>
        </Routes>
      {/* </BrowserRouter> */}
    </>
  )
}

export default PageRoutes