import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.appWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  )
}
