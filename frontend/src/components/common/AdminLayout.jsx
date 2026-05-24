import { useState } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main
        style={{ flex: 1, overflowY: 'auto', background: '#f0f4f8' }}
        onClick={() => setMobileOpen(false)}
      >
        {children}
      </main>
    </div>
  )
}