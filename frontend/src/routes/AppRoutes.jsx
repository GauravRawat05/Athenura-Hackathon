import { Routes, Route } from 'react-router-dom'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import VerifyEmail from '../pages/auth/VerifyEmail'
import ForgotPassword from '../pages/auth/ForgotPassword'

import Home from '../pages/participant/Home'
import HackathonDetail from '../pages/participant/HackathonDetail'
import Dashboard from '../pages/participant/Dashboard'
import Profile from '../pages/participant/Profile'
import SoloRegister from '../pages/participant/SoloRegister'
import TeamRegister from '../pages/participant/TeamRegister'
import TeamInviteAccept from '../pages/participant/TeamInviteAccept'
import Payment from '../pages/participant/Payment'
import PaymentStatus from '../pages/participant/PaymentStatus'
import ProjectSubmission from '../pages/participant/ProjectSubmission'
import Results from '../pages/participant/Results'
import Certificates from '../pages/participant/Certificates'

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

import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import VerifyCertificate from '../pages/public/VerifyCertificate'
import PublicWinners from '../pages/public/PublicWinners'
import NotFound from '../pages/public/NotFound'


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-certificate/:id" element={<VerifyCertificate />} />
      <Route path="/winners/:hackathonId" element={<PublicWinners />} />

      {/* Participant */}
      <Route path="/hackathon/:id" element={<HackathonDetail />} />
      <Route path="/hackathon/:id/register/solo" element={<SoloRegister />} />
      <Route path="/hackathon/:id/register/team" element={<TeamRegister />} />
      <Route path="/team/invite/:token" element={<TeamInviteAccept />} />
      <Route path="/payment/:registrationId" element={<Payment />} />
      <Route path="/payment/status" element={<PaymentStatus />} />
      <Route path="/hackathon/:id/submit" element={<ProjectSubmission />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/results/:hackathonId" element={<Results />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/profile" element={<Profile />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/hackathons" element={<HackathonList />} />
      <Route path="/admin/hackathons/create" element={<CreateHackathon />} />
      <Route path="/admin/hackathons/edit/:id" element={<CreateHackathon />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/hackathons/:id/judges" element={<AssignJudges />} />
      <Route path="/admin/hackathons/:id/winners" element={<DeclareWinners />} />
      <Route path="/admin/reports" element={<RevenueReports />} />
      <Route path="/admin/universities" element={<UniversityManagement />} />
      <Route path="/admin/certificates" element={<CertificateManagement />} />

      {/* Judge */}
      <Route path="/judge" element={<JudgeDashboard />} />
      <Route path="/judge/score/:submissionId" element={<ScoreSubmission />} />

      {/* University */}
      <Route path="/university" element={<UniversityDashboard />} />
      <Route path="/university/reports" element={<UniversityReports />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}