package com.klef.soa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.soa.entity.Candidate;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByNameContainingIgnoreCase(String name);
    List<Candidate> findByTypeIgnoreCase(String type);
    List<Candidate> findByStatusIgnoreCase(String status);
}
