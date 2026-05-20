import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        background: '#f0f4f8',
        marginLeft: isMobile ? '0px' : collapsed ? '72px' : '255px',
        transition: 'margin-left 0.35s cubic-bezier(.4,0,.2,1)'
      }}>
        {children}
      </main>
    </div>
  )
}