import axios from 'axios';

// Vite environment variable with fallback to backend port 2026
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2026';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*'
  }
});

/**
 * Normalizes error messages from server responses or network failures
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  // Network / Connection error (e.g. Spring Boot is not running)
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    return 'Unable to connect to the backend server at ' + BASE_URL + '. Please ensure your Spring Boot application is running on port 2026.';
  }

  // Request timeout
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. The backend server took too long to respond.';
  }

  // Server responded with an error status (4xx, 5xx)
  if (error.response) {
    const { status, data } = error.response;
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    if (data?.message) {
      return data.message;
    }
    if (status === 404) {
      return 'The requested resource or candidate was not found (HTTP 404).';
    }
    if (status === 400) {
      return 'Invalid request data. Please check your form inputs (HTTP 400).';
    }
    if (status === 500) {
      return 'Internal server error occurred in Spring Boot / MySQL (HTTP 500).';
    }
    return `Server responded with error status ${status}.`;
  }

  return error.message || 'An unexpected error occurred.';
};

/**
 * Candidate REST API Service
 * Exact endpoint routes mapped to com.klef.soa.controller.CandidateController
 */
export const candidateApi = {
  /**
   * Health / Root Check
   * GET /candidate/
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/candidate/');
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Fetch all candidates
   * GET /candidate/displayall
   */
  async getAllCandidates() {
    try {
      const response = await apiClient.get('/candidate/displayall');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Fetch candidate by ID using query parameter
   * GET /candidate/display?candidateId={candidateId}
   */
  async getCandidateById(candidateId) {
    try {
      const response = await apiClient.get('/candidate/display', {
        params: { candidateId }
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Create a new candidate
   * POST /candidate/add
   * Body: { name, type, status, location }
   */
  async addCandidate(candidateData) {
    try {
      // Backend auto-generates candidateId, createdAt, updatedAt
      const payload = {
        name: candidateData.name.trim(),
        type: candidateData.type.trim(),
        status: candidateData.status.trim(),
        location: candidateData.location.trim()
      };
      const response = await apiClient.post('/candidate/add', payload);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Update an existing candidate
   * PUT /candidate/update
   * Body: { candidateId, name, type, status, location }
   */
  async updateCandidate(candidateData) {
    try {
      const payload = {
        candidateId: Number(candidateData.candidateId),
        name: candidateData.name.trim(),
        type: candidateData.type.trim(),
        status: candidateData.status.trim(),
        location: candidateData.location.trim()
      };
      const response = await apiClient.put('/candidate/update', payload);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Delete candidate by ID
   * DELETE /candidate/delete/{candidateId}
   */
  async deleteCandidate(candidateId) {
    try {
      const response = await apiClient.delete(`/candidate/delete/${candidateId}`);
      // Backend returns string "Candidate Deleted Successfully" or "Candidate ID Not Found"
      if (typeof response.data === 'string' && response.data.includes('Not Found')) {
        throw new Error(response.data);
      }
      return response.data || 'Candidate Deleted Successfully';
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Search candidates by exact name (backend uses findByName derived query)
   * GET /candidate/displaybyname/{name}
   */
  async getCandidatesByName(name) {
    try {
      const encodedName = encodeURIComponent(name.trim());
      const response = await apiClient.get(`/candidate/displaybyname/${encodedName}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Search candidates by type / role (backend uses findByType derived query)
   * GET /candidate/displaybytype/{type}
   */
  async getCandidatesByType(type) {
    try {
      const encodedType = encodeURIComponent(type.trim());
      const response = await apiClient.get(`/candidate/displaybytype/${encodedType}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }
};

export default candidateApi;
