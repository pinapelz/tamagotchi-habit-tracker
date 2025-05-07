import { useState, useEffect } from 'react'
import DashboardRedesign from '../components/dashboard/DashboardRedesign'
import MobileDashboard from '../components/dashboard/MobileDashboard'

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) 
    }

    // Check initially
    checkMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile ? <MobileDashboard /> : <DashboardRedesign />
}
