import { useState } from 'react';
import {
  X, Calendar, Users, Trophy, DollarSign, Clock,
  CheckCircle, AlertCircle, Tag, ChevronDown, ChevronUp,
  CreditCard, Mail, User, Shield
} from 'lucide-react';
import styles from './HackathonModal.module.css';

const REGISTERED_IDS = new Set(); // mock registered hackathons

export default function HackathonModal({ hackathon, onClose }) {
  const [tab, setTab] = useState('overview');
  const [joinStep, setJoinStep] = useState(0); // 0=idle, 1=form, 2=payment, 3=success
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', team: '', size: 2 });
  const [errors, setErrors] = useState({});

  if (!hackathon) return null;

  const {
    id, title, tagline, status, mode, domain, prizePool, fee,
    participants, startDate, endDate, registrationDeadline,
    sponsors, logo, color, description, rules, timeline,
    prizes, judgingCriteria, tags, maxTeamSize, minTeamSize
  } = hackathon;

  const isDeadlinePassed = new Date(registrationDeadline) < new Date();
  const isAlreadyRegistered = REGISTERED_IDS.has(id);
  const canRegister = !isDeadlinePassed && !isAlreadyRegistered && status !== 'past';

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Valid email required';
    if (mode === 'team' && !form.team.trim()) e.team = 'Team name required';
    if (mode === 'team' && (form.size < minTeamSize || form.size > maxTeamSize))
      e.size = `Team size must be ${minTeamSize}–${maxTeamSize}`;
    return e;
  };

  const handleJoin = () => {
    if (joinStep === 0) { setJoinStep(1); setTab('join'); return; }
    if (joinStep === 1) {
      const e = validate();
      if (Object.keys(e).length) { setErrors(e); return; }
      if (fee > 0) { setJoinStep(2); } else { handleConfirm(); }
    }
    if (joinStep === 2) handleConfirm();
  };

  const handleConfirm = () => {
    REGISTERED_IDS.add(id);
    setJoinStep(3);
  };

  const statusConfig = {
    upcoming: { label: 'Upcoming', color: '#d97706', bg: 'rgba(245,158,11,0.1)' },
    ongoing:  { label: '● Live Now', color: '#059669', bg: 'rgba(16,185,129,0.1)' },
    past:     { label: 'Ended', color: '#94a3b8', bg: '#f1f5f9' },
  };
  const sc = statusConfig[status];

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header} style={{ background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}>
          <button className={styles.close} onClick={onClose}><X size={20} /></button>
          <div className={styles.headerContent}>
            <div className={styles.logoBox}>
              <span>{logo}</span>
            </div>
            <div>
              <div className={styles.headerMeta}>
                <span className={styles.domain}>{domain}</span>
                <span className={styles.status} style={{ color: sc.color, background: sc.bg }}>
                  {sc.label}
                </span>
              </div>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.tagline}>{tagline}</p>
              <div className={styles.keyStats}>
                <span><Trophy size={14} /> ${prizePool.toLocaleString()} Prize</span>
                <span><Users size={14} /> {participants.toLocaleString()} Registered</span>
                <span><Calendar size={14} /> {new Date(startDate).toLocaleDateString('en',{month:'short',day:'numeric'})} – {new Date(endDate).toLocaleDateString('en',{month:'short',day:'numeric'})}</span>
                <span><DollarSign size={14} /> {fee === 0 ? 'Free' : `$${fee} fee`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['overview','prizes','timeline','rules','join'].map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.activeTab : ''}`}
              onClick={() => { setTab(t); if (t === 'join' && joinStep === 0) setJoinStep(1); }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className={styles.section}>
              <p className={styles.description}>{description}</p>

              <div className={styles.tags}>
                {tags.map(t => (
                  <span key={t} className={styles.tag}><Tag size={11} />{t}</span>
                ))}
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Mode</div>
                  <div className={styles.infoValue}>{mode === 'solo' ? '👤 Solo' : '👥 Team'}</div>
                </div>
                {mode === 'team' && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Team Size</div>
                    <div className={styles.infoValue}>{minTeamSize}–{maxTeamSize} members</div>
                  </div>
                )}
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Registration Deadline</div>
                  <div className={styles.infoValue}>{new Date(registrationDeadline).toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'})}</div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Sponsors</div>
                  <div className={styles.infoValue}>{sponsors.join(', ')}</div>
                </div>
              </div>

              <div className={styles.criteria}>
                <h4>Judging Criteria</h4>
                {judgingCriteria.map(c => (
                  <div key={c.criterion} className={styles.criteriaRow}>
                    <span>{c.criterion}</span>
                    <div className={styles.bar}>
                      <div className={styles.barFill} style={{ width: `${c.weight}%`, background: color }} />
                    </div>
                    <span className={styles.weight}>{c.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRIZES */}
          {tab === 'prizes' && (
            <div className={styles.section}>
              <div className={styles.prizesGrid}>
                {prizes.map((p, i) => (
                  <div key={i} className={`${styles.prizeCard} ${i === 0 ? styles.firstPlace : ''}`}
                    style={i === 0 ? { borderColor: color, background: `${color}08` } : {}}>
                    <div className={styles.prizePlace}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {p.place}
                    </div>
                    <div className={styles.prizeAmount} style={i === 0 ? { color } : {}}>{p.amount}</div>
                    <ul className={styles.prizePerks}>
                      {p.perks.map(pk => (
                        <li key={pk}><CheckCircle size={13} />{pk}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIMELINE */}
          {tab === 'timeline' && (
            <div className={styles.section}>
              <div className={styles.timeline}>
                {timeline.map((t, i) => (
                  <div key={i} className={styles.timelineItem}>
                    <div className={styles.timelineDot} style={{ borderColor: color, background: i < 2 ? color : 'white' }} />
                    <div className={styles.timelineConnector} style={i < timeline.length - 1 ? { background: color + '44' } : { opacity: 0 }} />
                    <div className={styles.timelineContent}>
                      <div className={styles.timelinePhase}>{t.phase}</div>
                      <div className={styles.timelineDate}><Clock size={13} />{t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RULES */}
          {tab === 'rules' && (
            <div className={styles.section}>
              <ul className={styles.rulesList}>
                {rules.map((r, i) => (
                  <li key={i} className={styles.rule}>
                    <div className={styles.ruleNum}>{i + 1}</div>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* JOIN */}
          {tab === 'join' && (
            <div className={styles.section}>
              {!canRegister && !isAlreadyRegistered && (
                <div className={styles.alert}>
                  <AlertCircle size={18} />
                  {isDeadlinePassed ? 'Registration deadline has passed.' : 'This hackathon is not open for registration.'}
                </div>
              )}

              {isAlreadyRegistered && joinStep !== 3 && (
                <div className={styles.successBanner}>
                  <CheckCircle size={18} />
                  You are already registered for this hackathon!
                </div>
              )}

              {/* Step 3: Success */}
              {joinStep === 3 && (
                <div className={styles.successScreen}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3>You're In!</h3>
                  <p>Successfully registered for <strong>{title}</strong>.</p>
                  <p className={styles.successSub}>A confirmation email has been sent to <strong>{form.email}</strong>. You'll also receive real-time notifications about updates.</p>
                  <button className={styles.btnPrimary} style={{ background: color }} onClick={onClose}>
                    Back to Listings
                  </button>
                </div>
              )}

              {/* Step 1: Registration Form */}
              {joinStep === 1 && canRegister && (
                <div className={styles.form}>
                  <h4 className={styles.formTitle}>Registration Details</h4>

                  <div className={styles.field}>
                    <label><User size={14} />Full Name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className={errors.name ? styles.inputError : ''}
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>

                  <div className={styles.field}>
                    <label><Mail size={14} />Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={errors.email ? styles.inputError : ''}
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                  </div>

                  {mode === 'team' && (
                    <>
                      <div className={styles.field}>
                        <label><Users size={14} />Team Name</label>
                        <input
                          value={form.team}
                          onChange={e => setForm({ ...form, team: e.target.value })}
                          placeholder="Your team name"
                          className={errors.team ? styles.inputError : ''}
                        />
                        {errors.team && <span className={styles.error}>{errors.team}</span>}
                      </div>
                      <div className={styles.field}>
                        <label><Users size={14} />Team Size ({minTeamSize}–{maxTeamSize})</label>
                        <input
                          type="number"
                          min={minTeamSize}
                          max={maxTeamSize}
                          value={form.size}
                          onChange={e => setForm({ ...form, size: Number(e.target.value) })}
                          className={errors.size ? styles.inputError : ''}
                        />
                        {errors.size && <span className={styles.error}>{errors.size}</span>}
                      </div>
                    </>
                  )}

                  <div className={styles.feeSummary}>
                    <span>Registration Fee</span>
                    <strong style={{ color: fee === 0 ? '#059669' : var_color }}>{fee === 0 ? 'FREE' : `$${fee}`}</strong>
                  </div>

                  <button
                    className={styles.btnPrimary}
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                    onClick={handleJoin}
                  >
                    {fee > 0 ? 'Continue to Payment' : 'Confirm Registration'}
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {joinStep === 2 && (
                <div className={styles.form}>
                  <h4 className={styles.formTitle}><CreditCard size={16} /> Payment Details</h4>
                  <div className={styles.payAmount}>
                    Paying <strong>${fee}</strong> for {title}
                  </div>

                  <div className={styles.field}>
                    <label>Card Number</label>
                    <input placeholder="4242 4242 4242 4242" maxLength={19} />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Expiry</label>
                      <input placeholder="MM / YY" />
                    </div>
                    <div className={styles.field}>
                      <label>CVV</label>
                      <input placeholder="•••" type="password" maxLength={3} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Name on Card</label>
                    <input placeholder="Full name" />
                  </div>

                  <div className={styles.secureNote}>
                    <Shield size={13} /> Payments are secure and encrypted
                  </div>

                  <button
                    className={styles.btnPrimary}
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                    onClick={handleConfirm}
                  >
                    Pay ${fee} & Register
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {tab !== 'join' && joinStep !== 3 && (
          <div className={styles.footer}>
            {canRegister ? (
              <button
                className={styles.footerBtn}
                style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                onClick={() => { setTab('join'); setJoinStep(1); }}
              >
                Register Now — {fee === 0 ? 'Free' : `$${fee}`}
              </button>
            ) : isAlreadyRegistered ? (
              <div className={styles.registeredNote}><CheckCircle size={16} />Already registered</div>
            ) : (
              <div className={styles.closedNote}><AlertCircle size={16} />Registration closed</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const var_color = 'var(--ocean)';
