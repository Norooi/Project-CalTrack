package com.caltrack.service;

import com.caltrack.dto.EntryRequestDTO;
import com.caltrack.dto.SummaryResponseDTO;
import com.caltrack.model.Entry;
import com.caltrack.repository.EntryRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class EntryService {

    private final EntryRepository entryRepository;

    public EntryService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public List<Entry> findEntries(LocalDate date) {
        if (date != null) {
            return entryRepository.findByDate(date);
        }
        return entryRepository.findAll();
    }

    public Entry saveEntry(EntryRequestDTO request) {
        Entry entry = Entry.builder()
                .name(request.getName().trim())
                .calories(request.getCalories())
                .type(request.getType().trim().toUpperCase())
                .date(request.getDate())
                .createdAt(LocalDateTime.now())
                .build();
        return entryRepository.save(entry);
    }

    public void deleteEntry(String id) {
        if (!entryRepository.existsById(id)) {
            throw new NoSuchElementException("Entry with id " + id + " not found");
        }
        entryRepository.deleteById(id);
    }

    public SummaryResponseDTO getSummary(LocalDate date) {
        List<Entry> entries = findEntries(date);
        int consumed = entries.stream()
                .filter(e -> "MEAL".equalsIgnoreCase(e.getType()))
                .mapToInt(Entry::getCalories)
                .sum();
        int burned = entries.stream()
                .filter(e -> "WORKOUT".equalsIgnoreCase(e.getType()))
                .mapToInt(Entry::getCalories)
                .sum();
        return new SummaryResponseDTO(consumed, burned, consumed - burned);
    }
}
