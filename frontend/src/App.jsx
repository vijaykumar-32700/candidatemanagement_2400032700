import React, { useState, useEffect, useCallback } from 'react';
import candidateApi from './services/candidateApi';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import CandidateTable from './components/CandidateTable';
import CandidateForm from './components/CandidateForm';
import CandidateDetails from './components/CandidateDetails';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  // Modal & Dialog state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCandidateForEdit, setSelectedCandidateForEdit] = useState(null);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [deletingCandidate, setDeletingCandidate] = useState(null);

  // In-flight operation states
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Fetch all candidates from Spring Boot REST API
   * GET /candidate/displayall
   */
  const loadCandidates = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);
    setError(null);

    try {
      const data = await candidateApi.getAllCandidates();
      setCandidates(data);
      setIsBackendOnline(true);
      setActiveFilter(null);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError(err.message);
      setIsBackendOnline(false);
      if (isSilent) {
        addToast(err.message, 'error');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  // Initial load on component mount
  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  /**
   * Search by exact name
   * GET /candidate/displaybyname/{name}
   */
  const handleSearchByName = async (name) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await candidateApi.getCandidatesByName(name);
      setCandidates(results);
      setActiveFilter(`Name: "${name}"`);
      addToast(
        results.length > 0 
          ? `Found ${results.length} candidate(s) matching "${name}".` 
          : `No candidates found with exact name "${name}". (Note: backend findByName requires exact case/spelling).`,
        results.length > 0 ? 'info' : 'error'
      );
    } catch (err) {
      console.error('Search by name error:', err);
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filter by type / role
   * GET /candidate/displaybytype/{type}
   */
  const handleFilterByType = async (type) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await candidateApi.getCandidatesByType(type);
      setCandidates(results);
      setActiveFilter(`Role: "${type}"`);
      addToast(
        `Found ${results.length} candidate(s) for role "${type}".`, 
        'info'
      );
    } catch (err) {
      console.error('Filter by type error:', err);
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset filters to show complete database records
   */
  const handleResetFilters = () => {
    loadCandidates();
  };

  /**
   * Handle Create or Update candidate form submission
   */
  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);

    try {
      if (formData.candidateId) {
        // Update candidate (PUT /candidate/update)
        const updated = await candidateApi.updateCandidate(formData);
        addToast(`Candidate #${formData.candidateId} (${formData.name}) updated successfully!`, 'success');
        setIsFormModalOpen(false);
        setSelectedCandidateForEdit(null);
        await loadCandidates(true);
      } else {
        // Add new candidate (POST /candidate/add)
        const created = await candidateApi.addCandidate(formData);
        addToast(`Candidate "${created.name}" created successfully with ID #${created.candidateId}!`, 'success');
        setIsFormModalOpen(false);
        await loadCandidates(true);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      addToast(err.message, 'error', 6000);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  /**
   * Handle Delete candidate confirmation
   * DELETE /candidate/delete/{candidateId}
   */
  const handleConfirmDelete = async (candidateId) => {
    setIsDeleting(true);

    try {
      const message = await candidateApi.deleteCandidate(candidateId);
      addToast(message || `Candidate #${candidateId} was successfully deleted.`, 'success');
      setDeletingCandidate(null);
      await loadCandidates(true);
    } catch (err) {
      console.error('Delete error:', err);
      addToast(err.message, 'error', 6000);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Add Candidate Modal
  const handleOpenAddModal = () => {
    setSelectedCandidateForEdit(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Candidate Modal
  const handleOpenEditModal = (candidate) => {
    setSelectedCandidateForEdit(candidate);
    setIsFormModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onRemoveToast={removeToast} />

      {/* Top Navigation Bar */}
      <Navbar 
        isRefreshing={isRefreshing}
        onRefresh={() => loadCandidates(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* KPI / Recruitment Statistics */}
        <StatsCards candidates={candidates} />

        {/* Candidate Table with Filter/Search/CRUD */}
        <CandidateTable
          candidates={candidates}
          isLoading={isLoading}
          error={error}
          onRetry={() => loadCandidates(false)}
          onOpenAddModal={handleOpenAddModal}
          onViewCandidate={(c) => setViewingCandidate(c)}
          onEditCandidate={handleOpenEditModal}
          onDeleteCandidate={(c) => setDeletingCandidate(c)}
          onSearchByName={handleSearchByName}
          onFilterByType={handleFilterByType}
          onResetFilters={handleResetFilters}
          activeFilter={activeFilter}
        />
      </main>

      {/* Add / Edit Candidate Modal */}
      <CandidateForm
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCandidateForEdit(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedCandidateForEdit}
        isSubmitting={isSubmittingForm}
      />

      {/* View Candidate Details Modal */}
      <CandidateDetails
        isOpen={Boolean(viewingCandidate)}
        onClose={() => setViewingCandidate(null)}
        candidate={viewingCandidate}
        onEdit={(candidate) => {
          handleOpenEditModal(candidate);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCandidate)}
        onClose={() => setDeletingCandidate(null)}
        onConfirm={handleConfirmDelete}
        candidate={deletingCandidate}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Candidate Management System &bull; Spring Boot REST API (Port 2026) &bull; MySQL Database (`soataskdb`) &bull; React + Vite
        </p>
      </footer>
    </div>
  );
}

export default App;
