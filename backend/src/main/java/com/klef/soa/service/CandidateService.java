package com.klef.soa.service;

import java.util.List;
import java.util.Optional;

import com.klef.soa.entity.Candidate;

public interface CandidateService {
    Candidate createCandidate(Candidate candidate);
    List<Candidate> getAllCandidates();
    Optional<Candidate> getCandidateById(Long id);
    Optional<Candidate> updateCandidate(Long id, Candidate candidate);
    boolean deleteCandidate(Long id);
    List<Candidate> searchByName(String name);
    List<Candidate> searchByType(String type);
    List<Candidate> searchByStatus(String status);
}
