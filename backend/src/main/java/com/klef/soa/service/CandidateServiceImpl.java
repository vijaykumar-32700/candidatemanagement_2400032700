package com.klef.soa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klef.soa.entity.Candidate;
import com.klef.soa.repository.CandidateRepository;

@Service
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository repository;

    public CandidateServiceImpl(CandidateRepository repository) {
        this.repository = repository;
    }

    @Override
    public Candidate createCandidate(Candidate candidate) {
        candidate.setCandidateId(null);
        return repository.save(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Candidate> getAllCandidates() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Candidate> getCandidateById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Candidate> updateCandidate(Long id, Candidate candidate) {
        return repository.findById(id).map(existing -> {
            existing.setName(candidate.getName());
            existing.setType(candidate.getType());
            existing.setStatus(candidate.getStatus());
            existing.setLocation(candidate.getLocation());
            return repository.save(existing);
        });
    }

    @Override
    public boolean deleteCandidate(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Candidate> searchByName(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Candidate> searchByType(String type) {
        return repository.findByTypeIgnoreCase(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Candidate> searchByStatus(String status) {
        return repository.findByStatusIgnoreCase(status);
    }
}
