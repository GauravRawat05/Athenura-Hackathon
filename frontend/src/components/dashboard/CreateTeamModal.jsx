import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTeam } from '../../store/teamSlice';
import teamService from '../../services/teamService';
import { hackathonService } from '../../services/hackathonService';

const CreateTeamModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ teamName: '', description: '', hackathonId: '' });
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      hackathonService.getAllHackathons().then(res => {
        // Filter upcoming/ongoing/draft hackathons
        setHackathons(res.data.data.filter(h => 
          h.status === 'upcoming' || 
          h.status === 'ongoing' || 
          h.status === 'draft'
        ));
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.hackathonId) return alert("Please select a hackathon");
      const res = await teamService.createTeam(formData.hackathonId, { 
        teamName: formData.teamName, 
        description: formData.description 
      });
      
      if (onSuccess) {
        onSuccess(res.data?.data);
      } else {
        onClose();
        dispatch(fetchTeam(null));
      }
      setFormData({ teamName: '', description: '', hackathonId: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(3, 4, 94, 0.6)', 
      backdropFilter: 'blur(4px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 3000,
      padding: '20px'
    }}>
      <div style={{ 
        background: '#fff', 
        padding: '32px', 
        borderRadius: '24px', 
        width: '100%', 
        maxWidth: '440px',
        boxShadow: '0 20px 50px rgba(0, 30, 80, 0.3)',
        position: 'relative',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <h2 style={{ 
          fontFamily: "'Nunito', sans-serif", 
          fontWeight: 900, 
          fontSize: '24px', 
          color: '#03045E', 
          margin: '0 0 8px' 
        }}>Create New Team</h2>
        <p style={{ color: '#5A9BB5', fontSize: '14px', marginBottom: '24px' }}>
          Form a squad and prepare for your next challenge.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#1B6E95', 
              marginBottom: '6px' 
            }}>Target Hackathon *</label>
            <select 
              required 
              value={formData.hackathonId} 
              onChange={e => setFormData({...formData, hackathonId: e.target.value})} 
              style={{ 
                width: '100%',
                padding: '12px 16px', 
                borderRadius: '12px', 
                border: '1.5px solid #90D4EA',
                background: '#F5FBFE',
                color: '#0A3D5C',
                fontSize: '14px',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Choose a Hackathon --</option>
              {hackathons.map(h => (
                <option key={h._id} value={h._id}>{h.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#1B6E95', 
              marginBottom: '6px' 
            }}>Team Name *</label>
            <input 
              required 
              placeholder="e.g. Cyber Guardians" 
              value={formData.teamName} 
              onChange={e => setFormData({...formData, teamName: e.target.value})} 
              style={{ 
                width: '100%',
                padding: '12px 16px', 
                borderRadius: '12px', 
                border: '1.5px solid #90D4EA',
                background: '#F5FBFE',
                color: '#0A3D5C',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }} 
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#1B6E95', 
              marginBottom: '6px' 
            }}>Description</label>
            <textarea 
              placeholder="Tell us what your team is about..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              style={{ 
                width: '100%',
                padding: '12px 16px', 
                borderRadius: '12px', 
                border: '1.5px solid #90D4EA',
                background: '#F5FBFE',
                color: '#0A3D5C',
                fontSize: '14px',
                outline: 'none',
                minHeight: '100px',
                resize: 'none',
                boxSizing: 'border-box'
              }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{ 
                flex: 1,
                padding: '13px', 
                background: '#EBF7FC', 
                color: '#1B6E95', 
                border: '1px solid #90D4EA', 
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                flex: 2,
                padding: '13px', 
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0077B6, #00B4D8)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 20px rgba(0, 119, 182, 0.28)'
              }}
            >
              {loading ? 'Creating...' : 'Create Team 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
