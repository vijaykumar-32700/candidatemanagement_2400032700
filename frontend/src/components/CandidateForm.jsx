import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

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
  'UI/UX Designer',
  'Other'
];

const CandidateForm = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const isEditMode = Boolean(initialData && initialData.candidateId);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Full Stack Developer',
    customType: '',
    status: 'Shortlisted',
    location: ''
  });

  const [errors, setErrors] = useState({});

  // Reset or populate form when opened or initialData changes
  useEffect(() => {
    if (initialData) {
      const isPresetType = PRESET_TYPES.includes(initialData.type);
      setFormData({
        name: initialData.name || '',
        type: isPresetType ? initialData.type : 'Other',
        customType: isPresetType ? '' : (initialData.type || ''),
        status: initialData.status || 'Shortlisted',
        location: initialData.location || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'Full Stack Developer',
        customType: '',
        status: 'Shortlisted',
        location: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Field validation
  const validate = () => {
    const newErrors = {};

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Candidate name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Candidate name must be at least 2 characters long.';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Candidate name cannot exceed 100 characters.';
    }

    const finalType = formData.type === 'Other' ? formData.customType.trim() : formData.type.trim();
    if (!finalType) {
      newErrors.type = 'Job role / candidate type is required.';
    } else if (finalType.length > 50) {
      newErrors.type = 'Candidate type cannot exceed 50 characters.';
    }

    const trimmedStatus = formData.status.trim();
    if (!trimmedStatus) {
      newErrors.status = 'Candidate status is required.';
    }

    const trimmedLocation = formData.location.trim();
    if (!trimmedLocation) {
      newErrors.location = 'Candidate location is required.';
    } else if (trimmedLocation.length < 2) {
      newErrors.location = 'Location must be at least 2 characters long.';
    } else if (trimmedLocation.length > 100) {
      newErrors.location = 'Location cannot exceed 100 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalType = formData.type === 'Other' ? formData.customType.trim() : formData.type.trim();

    const payload = {
      ...(isEditMode ? { candidateId: initialData.candidateId } : {}),
      name: formData.name.trim(),
      type: finalType,
      status: formData.status.trim(),
      location: formData.location.trim()
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="form-modal-title"
      >
        <div className="modal-header">
          <h3 id="form-modal-title">
            {isEditMode ? `Edit Candidate #${initialData.candidateId}` : 'Add New Candidate'}
          </h3>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* If Edit Mode: Display read-only primary key */}
            {isEditMode && (
              <div className="form-group">
                <label className="form-label" htmlFor="candidateId">
                  Candidate ID (Primary Key)
                </label>
                <input
                  id="candidateId"
                  type="text"
                  className="form-control"
                  value={initialData.candidateId}
                  disabled
                  readOnly
                />
                <div className="form-hint">Generated automatically by MySQL (AUTO_INCREMENT)</div>
              </div>
            )}

            {/* Candidate Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                autoFocus
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            {/* Candidate Type / Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="type">
                Job Role / Type <span className="required">*</span>
              </label>
              <select
                id="type"
                name="type"
                className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                value={formData.type}
                onChange={handleChange}
              >
                {PRESET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {formData.type === 'Other' && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    name="customType"
                    className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                    placeholder="Enter custom role / type..."
                    value={formData.customType}
                    onChange={handleChange}
                    maxLength={50}
                  />
                </div>
              )}
              {errors.type && <div className="form-error">{errors.type}</div>}
            </div>

            {/* Recruitment Status */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Recruitment Status <span className="required">*</span>
              </label>
              <select
                id="status"
                name="status"
                className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.status && <div className="form-error">{errors.status}</div>}
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Work Location / City <span className="required">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                placeholder="e.g. Hyderabad, Bangalore, or Remote"
                value={formData.location}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0 }} />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditMode ? 'Update Candidate' : 'Create Candidate'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
