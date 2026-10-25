import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  candidate,
  isDeleting = false
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              backgroundColor: 'var(--danger-light)', 
              color: 'var(--danger)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <AlertTriangle size={20} />
            </div>
            <h3 id="confirm-dialog-title" style={{ color: 'var(--danger)', margin: 0 }}>
              Confirm Candidate Deletion
            </h3>
          </div>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Cancel deletion"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p id="confirm-dialog-desc" style={{ fontSize: '0.92rem', color: 'var(--navy-800)', marginBottom: 12 }}>
            Are you sure you want to permanently delete candidate <strong>{candidate.name}</strong>?
          </p>

          <div style={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-md)', 
            padding: '12px 16px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <div><strong>Candidate ID:</strong> #{candidate.candidateId}</div>
            <div><strong>Job Role:</strong> {candidate.type}</div>
            <div><strong>Status:</strong> {candidate.status}</div>
            <div><strong>Location:</strong> {candidate.location}</div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: 12, fontWeight: 500 }}>
            * This action cannot be undone. The record will be permanently deleted from MySQL database table `candidate_table`.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(candidate.candidateId)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0 }} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Candidate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
