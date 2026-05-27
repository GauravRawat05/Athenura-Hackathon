import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import { setCredentials } from './store/authSlice'
import { authService } from './services/authService'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await authService.getMe()
          const user = response.data.data
          dispatch(setCredentials({ user, token }))
        } catch (error) {
          
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [dispatch])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #03045E 0%, #0077b6 100%)',
        color: 'white',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255,255,255,0.2)',
          borderTopColor: '#90E0EF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <h3 style={{ fontWeight: 600, letterSpacing: '0.05em' }}>Loading HackWave...</h3>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App