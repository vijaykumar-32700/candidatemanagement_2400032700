package com.klef.soa.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klef.soa.entity.Candidate;
import com.klef.soa.service.CandidateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CandidateController {

    private final CandidateService service;

    public CandidateController(CandidateService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Candidate> createCandidate(@Valid @RequestBody Candidate candidate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createCandidate(candidate));
    }

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return service.getAllCandidates();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable Long id) {
        return service.getCandidateById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidate> updateCandidate(
            @PathVariable Long id, @Valid @RequestBody Candidate candidate) {
        return service.updateCandidate(id, candidate)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        return service.deleteCandidate(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/search/name")
    public List<Candidate> searchByName(@RequestParam String value) {
        return service.searchByName(value);
    }

    @GetMapping("/search/type")
    public List<Candidate> searchByType(@RequestParam String value) {
        return service.searchByType(value);
    }

    @GetMapping("/search/status")
    public List<Candidate> searchByStatus(@RequestParam String value) {
        return service.searchByStatus(value);
    }
}
