import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import styles from './AdminLayout.module.css'

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={styles.layout}>
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((prev) => !prev)} />
      <div className={styles.main}>
        <Navbar onToggleSidebar={() => setIsCollapsed((prev) => !prev)} />
        <div className={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default AdminLayout
