import React from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../Layout/Navbar/Navbar'
import Footer from '../Layout/Footer/Footer'


function MasterLayout() {
  return (
    <div>
      <Navbar />

      
        <Outlet />

      
      <Footer />
    </div>
  )
}



export default MasterLayout