package com.caltrack.controller;

import com.caltrack.dto.EntryRequestDTO;
import com.caltrack.dto.SummaryResponseDTO;
import com.caltrack.model.Entry;
import com.caltrack.service.EntryService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CalTrackController {

    private final EntryService entryService;

    public CalTrackController(EntryService entryService) {
        this.entryService = entryService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "database", "MongoDB");
    }

    @GetMapping("/entries")
    public List<Entry> getEntries(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        return entryService.findEntries(date);
    }

    @PostMapping("/entries")
    public ResponseEntity<Entry> createEntry(@Valid @RequestBody EntryRequestDTO request) {
        Entry savedEntry = entryService.saveEntry(request);
        return new ResponseEntity<>(savedEntry, HttpStatus.CREATED);
    }

    @DeleteMapping("/entries/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable String id) {
        entryService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public SummaryResponseDTO getSummary(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        return entryService.getSummary(date);
    }
}
