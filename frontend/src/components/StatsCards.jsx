import React from 'react';
import { Users, CheckCircle, Award, Clock } from 'lucide-react';

const StatsCards = ({ candidates = [] }) => {
  const total = candidates.length;

  // Safe case-insensitive matching for real candidate status values
  const selectedCount = candidates.filter(c => {
    const s = (c.status || '').toLowerCase().trim();
    return s === 'selected' || s === 'hired' || s === 'offered';
  }).length;

  const shortlistedCount = candidates.filter(c => {
    const s = (c.status || '').toLowerCase().trim();
    return s === 'shortlisted';
  }).length;

  // Interviewing, Applied, Screening, or other active statuses
  const interviewOrOtherCount = candidates.filter(c => {
    const s = (c.status || '').toLowerCase().trim();
    return s.includes('interview') || s === 'applied' || s === 'screening' || s === 'on hold';
  }).length;

  return (
    <div className="stats-grid">
      {/* Total Candidates Card */}
      <div className="stat-card">
        <div className="stat-info">
          <h3>Total Candidates</h3>
          <div className="stat-value">{total}</div>
          <div className="stat-meta">Active database records</div>
        </div>
        <div className="stat-icon-wrapper blue">
          <Users size={24} />
        </div>
      </div>

      {/* Selected Candidates Card */}
      <div className="stat-card">
        <div className="stat-info">
          <h3>Selected</h3>
          <div className="stat-value">{selectedCount}</div>
          <div className="stat-meta">
            {total > 0 ? `${Math.round((selectedCount / total) * 100)}% of total pool` : '0% of total pool'}
          </div>
        </div>
        <div className="stat-icon-wrapper emerald">
          <CheckCircle size={24} />
        </div>
      </div>

      {/* Shortlisted Candidates Card */}
      <div className="stat-card">
        <div className="stat-info">
          <h3>Shortlisted</h3>
          <div className="stat-value">{shortlistedCount}</div>
          <div className="stat-meta">
            {total > 0 ? `${Math.round((shortlistedCount / total) * 100)}% under consideration` : 'Ready for review'}
          </div>
        </div>
        <div className="stat-icon-wrapper purple">
          <Award size={24} />
        </div>
      </div>

      {/* Interview / Pipeline Card */}
      <div className="stat-card">
        <div className="stat-info">
          <h3>Interview / Pipeline</h3>
          <div className="stat-value">{interviewOrOtherCount}</div>
          <div className="stat-meta">Screening or in-progress</div>
        </div>
        <div className="stat-icon-wrapper amber">
          <Clock size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
