import React from 'react';
import { X, Edit3, Calendar, Clock, MapPin, Briefcase, Hash, User } from 'lucide-react';

const CandidateDetails = ({ isOpen, onClose, candidate, onEdit }) => {
  if (!isOpen || !candidate) return null;

  // Format full timestamp (date + time)
  const formatTimestamp = (ts) => {
    if (!ts) return 'Not recorded';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return ts;
    }
  };

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase().trim();
    if (s === 'selected' || s === 'hired' || s === 'offered') return 'badge-selected';
    if (s === 'shortlisted') return 'badge-shortlisted';
    if (s.includes('interview')) return 'badge-interview';
    if (s === 'applied' || s === 'screening') return 'badge-applied';
    if (s === 'rejected') return 'badge-rejected';
    if (s === 'on hold' || s === 'hold') return 'badge-hold';
    return 'badge-default';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content modal-lg" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar-chip" style={{ width: 38, height: 38, fontSize: '0.9rem' }}>
              {(candidate.name || 'C').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 id="details-modal-title" style={{ fontSize: '1.2rem', marginBottom: 2 }}>
                {candidate.name}
              </h3>
              <span className={`badge ${getStatusBadgeClass(candidate.status)}`}>
                {candidate.status || 'Unknown'}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onClose}
            aria-label="Close candidate details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            {/* Candidate ID */}
            <div className="detail-item">
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Hash size={13} />
                <span>Candidate ID</span>
              </div>
              <div className="detail-value">
                <span className="candidate-id-cell">#{candidate.candidateId}</span>
              </div>
            </div>

            {/* Candidate Full Name */}
            <div className="detail-item">
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={13} />
                <span>Candidate Name</span>
              </div>
              <div className="detail-value">{candidate.name || '—'}</div>
            </div>

            {/* Role / Type */}
            <div className="detail-item">
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Briefcase size={13} />
                <span>Job Role / Type</span>
              </div>
              <div className="detail-value">{candidate.type || '—'}</div>
            </div>

            {/* Location */}
            <div className="detail-item">
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} />
                <span>Work Location</span>
              </div>
              <div className="detail-value">{candidate.location || '—'}</div>
            </div>

            {/* Created Timestamp */}
            <div className="detail-item">
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} />
                <span>Created At (MySQL / Hibernate)</span>
              </div>
              <div className="detail-value timestamp">
                {formatTimestamp(candidate.createdAt)}
              </div>
            </div>

            {/* Updated Timestamp */}
            <div className="detail-item">
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} />
                <span>Last Updated (Hibernate)</span>
              </div>
              <div className="detail-value timestamp">
                {formatTimestamp(candidate.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(candidate);
            }}
          >
            <Edit3 size={15} />
            <span>Edit Candidate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
