import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  UserPlus, 
  AlertCircle, 
  Inbox,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const STATUS_OPTIONS = [
  'Applied',
  'Screening',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
  'On Hold'
];

const PRESET_TYPES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Java Developer',
  'QA / Test Engineer',
  'Data Analyst',
  'DevOps Engineer',
  'UI/UX Designer'
];

const CandidateTable = ({
  candidates = [],
  isLoading,
  error,
  onRetry,
  onOpenAddModal,
  onViewCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onSearchByName,
  onFilterByType,
  onResetFilters,
  activeFilter
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  
  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Status badge styling helper
  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase().trim();
    let badgeClass = 'badge-default';

    if (s === 'selected' || s === 'hired' || s === 'offered') {
      badgeClass = 'badge-selected';
    } else if (s === 'shortlisted') {
      badgeClass = 'badge-shortlisted';
    } else if (s.includes('interview')) {
      badgeClass = 'badge-interview';
    } else if (s === 'applied' || s === 'screening') {
      badgeClass = 'badge-applied';
    } else if (s === 'rejected') {
      badgeClass = 'badge-rejected';
    } else if (s === 'on hold' || s === 'hold') {
      badgeClass = 'badge-hold';
    }

    return (
      <span className={`badge ${badgeClass}`}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }} />
        {status || 'Unknown'}
      </span>
    );
  };

  // Safe date formatting helper
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Handle Search by Name submit
  const handleNameSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setCurrentPage(1);
    onSearchByName(searchInput.trim());
  };

  // Handle Filter by Type change
  const handleTypeSelectChange = (e) => {
    const selectedType = e.target.value;
    setTypeInput(selectedType);
    setCurrentPage(1);
    if (selectedType) {
      onFilterByType(selectedType);
    } else {
      onResetFilters();
    }
  };

  // Handle Reset Filters
  const handleReset = () => {
    setSearchInput('');
    setTypeInput('');
    setCurrentPage(1);
    onResetFilters();
  };

  // Pagination calculation
  const totalItems = candidates.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentCandidates = candidates.slice(startIndex, startIndex + pageSize);

  // Avatar initial letter helper
  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="table-card">
      {/* Top Header Bar */}
      <div className="table-header-bar">
        <div className="table-title-area">
          <h2>Candidate Records</h2>
          <p>
            {activeFilter 
              ? `Filtered view: ${activeFilter} (${totalItems} found)` 
              : `Showing all candidates from MySQL soataskdb (${totalItems} total)`}
          </p>
        </div>

        <div className="table-actions-area">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <UserPlus size={16} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="filter-toolbar">
        {/* Search by Name */}
        <form onSubmit={handleNameSearchSubmit} className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by exact name (backend findByName)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={handleNameSearchSubmit}
          disabled={!searchInput.trim() || isLoading}
        >
          <Search size={14} />
          <span>Search</span>
        </button>

        {/* Filter by Type / Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={15} color="var(--text-muted)" />
          <select 
            className="filter-select"
            value={typeInput}
            onChange={handleTypeSelectChange}
            aria-label="Filter by Candidate Role or Type"
          >
            <option value="">All Job Roles / Types</option>
            {PRESET_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Reset / Clear Filters */}
        {(activeFilter || searchInput || typeInput) && (
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={handleReset}
            title="Reset filters and display all candidates"
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Main Content: Loading, Error, Empty, or Table */}
      {isLoading ? (
        <div className="state-container">
          <div className="spinner" />
          <h3>Connecting to Spring Boot Backend...</h3>
          <p>Retrieving candidate records from port 2026</p>
        </div>
      ) : error ? (
        <div className="state-container">
          <div className="state-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <AlertCircle size={28} />
          </div>
          <h3>Failed to Load Candidates</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            <RotateCcw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">
            <Inbox size={28} />
          </div>
          <h3>No Candidates Found</h3>
          <p>
            {activeFilter 
              ? `No candidate records matched the filter "${activeFilter}". Try clearing your search or adding a new candidate.` 
              : 'There are currently no candidates registered in the database. Click "Add Candidate" to create the first record.'}
          </p>
          {activeFilter ? (
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>Show All Candidates</span>
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
              <UserPlus size={16} />
              <span>Add Candidate</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Candidate Name</th>
                  <th>Role / Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((candidate) => (
                  <tr key={candidate.candidateId}>
                    <td>
                      <span className="candidate-id-cell">#{candidate.candidateId}</span>
                    </td>
                    <td>
                      <div className="candidate-name-cell">
                        <div className="avatar-chip">
                          {getInitials(candidate.name)}
                        </div>
                        <div>
                          <span>{candidate.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--navy-800)' }}>
                        {candidate.type}
                      </span>
                    </td>
                    <td>
                      {renderStatusBadge(candidate.status)}
                    </td>
                    <td>
                      <div className="location-cell">
                        <MapPin size={14} color="var(--text-muted)" />
                        <span>{candidate.location}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {formatDate(candidate.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          title="View Candidate Details"
                          onClick={() => onViewCandidate(candidate)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Candidate"
                          onClick={() => onEditCandidate(candidate)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon delete"
                          title="Delete Candidate"
                          onClick={() => onDeleteCandidate(candidate)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Client-side Pagination Controls */}
          <div className="pagination-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Rows per page:</span>
              <select 
                value={pageSize} 
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="filter-select"
                style={{ padding: '4px 24px 4px 8px', fontSize: '0.8rem' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="page-info">
                Showing {startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems}
              </span>
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '6px 10px' }}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <span className="page-info" style={{ padding: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '6px 10px' }}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateTable;
