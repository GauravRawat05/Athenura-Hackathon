import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminNotifications from '../pages/admin/AdminNotifications'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import VerifyEmail from '../pages/auth/VerifyEmail'
import ForgotPassword from '../pages/auth/ForgotPassword'

import Home from '../pages/participant/Home'
import HackathonDetail from '../pages/participant/HackathonDetail'
import Dashboard from '../pages/participant/Dashboard'
import Profile from '../pages/participant/Profile'
import TeamInviteAccept from '../pages/participant/TeamInviteAccept'
import Payment from '../pages/participant/Payment'
import PaymentStatus from '../pages/participant/PaymentStatus'
import ProjectSubmission from '../pages/participant/ProjectSubmission'
import Results from '../pages/participant/Results'
import Certificates from '../pages/participant/Certificates'
import MyHackathons from '../pages/participant/MyHackathons'   // ✅ NEW
import MySubmissions from '../pages/participant/MySubmissions' // ✅ NEW
import MyResults from '../pages/participant/MyResults'         // ✅ NEW
import ExploreHackathons from '../pages/participant/ExploreHackathons' // ✅ NEW

import AdminDashboard from '../pages/admin/AdminDashboard'
import CreateHackathon from '../pages/admin/CreateHackathon'
import HackathonList from '../pages/admin/HackathonList'
import UserManagement from '../pages/admin/UserManagement'
import AssignJudges from '../pages/admin/AssignJudges'
import DeclareWinners from '../pages/admin/DeclareWinners'
import RevenueReports from '../pages/admin/RevenueReports'
import UniversityManagement from '../pages/admin/UniversityManagement'
import CertificateManagement from '../pages/admin/CertificateManagement'

import JudgeDashboard from '../pages/judge/JudgeDashboard'
import ScoreSubmission from '../pages/judge/ScoreSubmission'

import UniversityDashboard from '../pages/university/UniversityDashboard'
import UniversityReports from '../pages/university/UniversityReports'

import VerifyCertificate from '../pages/public/VerifyCertificate'
import PublicWinners from '../pages/public/PublicWinners'
import NotFound from '../pages/public/NotFound'
import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import Result from '../pages/public/Result' // ✅ NEW

import Layout from '../components/common/Layout' // ✅ NEW
import AdminLayout from '../components/common/AdminLayout'
import PublicLayout from '../components/common/PublicLayout' // ✅ NEW


import PublicHackathonList from '../components/common/HackathonList'
import HackathonJoin from '../pages/participant/HackathonJoin'
import HostHackathon from '../pages/admin/HostHackathon'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
    const roleLower = user.role?.toLowerCase()
    if (roleLower === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (roleLower === 'university') {
      return <Navigate to="/university" replace />
    } else if (roleLower === 'judge') {
      return <Navigate to="/judge" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/hackathons" element={<PublicLayout><PublicHackathonList /></PublicLayout>} />
      <Route path="/hackathons/:id/join" element={<PublicLayout><HackathonJoin /></PublicLayout>} />
      <Route path="/host" element={<PublicLayout><HostHackathon /></PublicLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-certificate/:id" element={<PublicLayout><VerifyCertificate /></PublicLayout>} />
      <Route path="/winners/:hackathonId" element={<PublicLayout><PublicWinners /></PublicLayout>} />
      <Route path="/result" element={<PublicLayout><Result /></PublicLayout>} /> {/* ✅ NEW */}

      {/* Participant */}
      <Route path="/hackathon/:id" element={<PublicLayout><HackathonDetail /></PublicLayout>} />
      <Route path="/team/invite/:token" element={<ProtectedRoute><TeamInviteAccept /></ProtectedRoute>} />
      <Route path="/payment/:registrationId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/payment/status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
      <Route path="/hackathon/:id/submit" element={<ProtectedRoute><ProjectSubmission /></ProtectedRoute>} />
      <Route path="/results/:hackathonId" element={<ProtectedRoute><Results /></ProtectedRoute>} />

      {/* ✅ Sidebar wali pages — Layout mein wrap */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><Layout><Certificates /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/my-hackathons" element={<ProtectedRoute><Layout><MyHackathons /></Layout></ProtectedRoute>} />
      <Route path="/explore-hackathons" element={<ProtectedRoute><Layout><ExploreHackathons /></Layout></ProtectedRoute>} />
      <Route path="/my-submissions" element={<Navigate to="/my-hackathons" replace />} />
      <Route path="/my-results" element={<ProtectedRoute><Layout><MyResults /></Layout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/hackathons" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><HackathonList /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/hackathons/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><CreateHackathon /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/hackathons/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><CreateHackathon /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><UserManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/hackathons/:id/judges" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AssignJudges /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/hackathons/:id/winners" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><DeclareWinners /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><RevenueReports /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/universities" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><UniversityManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/certificates" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><CertificateManagement /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminNotifications /></AdminLayout></ProtectedRoute>} />

      {/* Judge */}
      <Route path="/judge" element={<ProtectedRoute allowedRoles={['judge']}><JudgeDashboard /></ProtectedRoute>} />
      <Route path="/judge/score/:submissionId" element={<ProtectedRoute allowedRoles={['judge']}><ScoreSubmission /></ProtectedRoute>} />

      {/* University */}
      <Route path="/university" element={<ProtectedRoute allowedRoles={['university']}><UniversityDashboard /></ProtectedRoute>} />
      <Route path="/university/reports" element={<ProtectedRoute allowedRoles={['university']}><UniversityReports /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}