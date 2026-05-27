import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeam, fetchMyTeams, fetchMyInvitations } from '../../store/teamSlice';
import teamService from '../../services/teamService';
import CreateTeamModal from '../../components/dashboard/CreateTeamModal';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,4,94,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 20, width: '90%', maxWidth: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: '#03045E', margin: '0 0 20px' }}>{title}</h3>
        {children}
        <button onClick={onClose} style={{ marginTop: 20, width: '100%', padding: '12px', background: 'rgba(144,224,239,0.1)', border: '1px solid rgba(144,224,239,0.2)', borderRadius: 10, color: '#03045E', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
};

const TeamsPage = () => {
  const dispatch = useDispatch();
  const { currentTeam, myTeams, myInvitations, loading } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('teams');
  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(fetchMyTeams());
    dispatch(fetchMyInvitations());
  }, [dispatch]);

  const handleAcceptInvitation = async (invitationId) => {
    await teamService.acceptInvitation(invitationId);
    dispatch(fetchMyTeams());
    dispatch(fetchMyInvitations());
  };

  const handleDeclineInvitation = async (invitationId) => {
    await teamService.declineInvitation(invitationId);
    dispatch(fetchMyInvitations());
  };

  const handleSelectTeam = (teamId) => {
    dispatch(fetchTeam(teamId));
  };

  const handleRemoveMember = async (memberId) => {
    await teamService.removeMember(currentTeam._id, memberId);
    dispatch(fetchTeam(currentTeam._id));
  };

  const handleInviteMember = async () => {
    await teamService.inviteMember(currentTeam._id, email);
    setShowInviteModal(false);
    setEmail('');
    alert('Invitation sent successfully!');
  };

  const transferLeadership = async (newLeaderId) => {
    await teamService.updateTeam(currentTeam._id, { leader: newLeaderId });
    dispatch(fetchTeam(currentTeam._id));
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) return;
    try {
      await teamService.deleteTeam(currentTeam._id);
      dispatch(clearTeam());
      dispatch(fetchMyTeams());
      alert("Team deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete team");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    dispatch(fetchMyTeams());
  };

  if (loading) return <div className="p-8 text-center text-[#0077B6] font-semibold">Loading team dashboard...</div>;

  return (
    <div style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 32, color: '#03045E', margin: 0 }}>Team Dashboard</h1>
        <button 
          onClick={() => setShowCreateModal(true)} 
          style={{ 
            padding: '12px 24px', 
            background: 'linear-gradient(135deg, #0077B6, #00B4D8)', 
            border: 'none', 
            borderRadius: 12, 
            color: '#fff', 
            fontWeight: 700, 
            cursor: 'pointer', 
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(0,119,182,0.2)'
          }}
        >
          + Create Team
        </button>
      </div>

      <CreateTeamModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSuccess={handleCreateSuccess}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button onClick={() => setActiveTab('teams')} style={{ padding: '8px 16px', background: activeTab === 'teams' ? '#0077B6' : 'transparent', color: activeTab === 'teams' ? '#fff' : '#03045E', border: '1px solid #0077B6', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>My Teams</button>
        <button onClick={() => setActiveTab('invitations')} style={{ padding: '8px 16px', background: activeTab === 'invitations' ? '#0077B6' : 'transparent', color: activeTab === 'invitations' ? '#fff' : '#03045E', border: '1px solid #0077B6', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Invitations ({myInvitations.length})</button>
      </div>

      {activeTab === 'invitations' ? (
        <div style={{ padding: 24, background: '#fff', borderRadius: 24, border: '1px solid rgba(0,180,216,0.2)' }}>
          {myInvitations.length === 0 ? <p>No pending invitations.</p> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {myInvitations.map(inv => (
                <div key={inv._id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Invited to <strong>{inv.teamId.teamName}</strong> by {inv.invitedBy.fullName}</span>
                  <div>
                    <button onClick={() => handleAcceptInvitation(inv._id)} style={{ marginRight: 8, padding: '4px 8px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Accept</button>
                    <button onClick={() => handleDeclineInvitation(inv._id)} style={{ padding: '4px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Team Selector and Team Content */}
          {myTeams.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, color: '#03045E', marginBottom: 12 }}>Your Teams:</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {myTeams.map(team => (
                  <button 
                    key={team._id} 
                    onClick={() => handleSelectTeam(team._id)}
                    style={{ 
                      padding: '10px 16px', 
                      borderRadius: 12, 
                      background: currentTeam?._id === team._id ? '#0077B6' : '#fff',
                      color: currentTeam?._id === team._id ? '#fff' : '#03045E',
                      border: '1px solid #0077B6',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {team.teamName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!currentTeam ? (
            <div style={{ padding: 48, background: '#fff', borderRadius: 24, border: '1px solid rgba(0,180,216,0.2)', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,119,182,0.05)' }}>
              <p style={{ color: '#64748b', fontSize: 16 }}>Select a team from above or create a new one to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 24 }}>
              {/* Overview */}
              <div style={{ padding: 24, background: '#fff', borderRadius: 24, border: '1px solid rgba(0,180,216,0.2)', boxShadow: '0 8px 30px rgba(0,119,182,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '4px 12px', 
                      borderRadius: '8px', 
                      background: 'rgba(0,119,182,0.1)', 
                      color: '#0077B6', 
                      fontSize: '11px', 
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: '12px'
                    }}>
                       {currentTeam.hackathonId?.title || "Hackathon"}
                    </div>
                    <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 24, color: '#03045E', margin: '0 0 8px' }}>{currentTeam.teamName}</h2>
                    <p style={{ color: '#475569', fontSize: 14, margin: '0 0 16px' }}>{currentTeam.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {user?._id === currentTeam.leader._id && (
                      <button 
                        onClick={handleDeleteTeam} 
                        style={{ 
                          padding: '10px 18px', 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          border: '1px solid rgba(239, 68, 68, 0.3)', 
                          borderRadius: 10, 
                          color: '#ef4444', 
                          fontWeight: 600, 
                          cursor: 'pointer' 
                        }}
                      >
                        Delete Team
                      </button>
                    )}
                    <button onClick={() => setShowInviteModal(true)} style={{ padding: '10px 18px', background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 10, color: '#0077B6', fontWeight: 600, cursor: 'pointer' }}>+ Invite Member</button>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div style={{ padding: 24, background: '#fff', borderRadius: 24, border: '1px solid rgba(0,180,216,0.2)', boxShadow: '0 8px 30px rgba(0,119,182,0.08)' }}>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, color: '#03045E', margin: '0 0 20px' }}>Team Members</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {currentTeam.members.map(m => (
                    <div key={m.userId._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(0,180,216,0.03)', borderRadius: 16, border: '1px solid rgba(0,180,216,0.1)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#03045E', fontSize: 14 }}>{m.userId.fullName || "Member"}</div>
                        <div style={{ fontSize: 11, color: '#0077B6', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>{m.role}</div>
                      </div>                      {user?._id === currentTeam.leader._id && m.userId._id !== user._id && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => transferLeadership(m.userId._id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(144,224,239,0.2)', border: 'none', color: '#03045E', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Transfer Lead</button>
                          <button onClick={() => handleRemoveMember(m.userId._id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite New Member">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid rgba(0,180,216,0.3)', marginBottom: 16 }} />
        <button onClick={handleInviteMember} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #0077B6, #00B4D8)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Send Invitation</button>
      </Modal>
    </div>
  );
};

export default TeamsPage;
